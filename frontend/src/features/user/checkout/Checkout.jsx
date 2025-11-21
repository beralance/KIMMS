import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Divider, Stack, FormControl, InputLabel, Select, MenuItem, IconButton, Collapse } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useCheckout } from "../../../contexts/CheckoutContext";
import { BanknoteIcon, ChevronLeftIcon, InfoIcon, MapPinIcon, Package2Icon, PackageOpenIcon, ReceiptTextIcon, WalletIcon} from 'lucide-react'
import { toTitleCase, formatNumber} from '../../../utils/stringUtils'
import { fetchAuctions} from '../../../utils/auctionApi'
import { getBidders} from '../../../utils/bidApi'
import { getDistanceInKm } from '../../../utils/haversine'
import { calculateInterIslandShipping } from '../../../utils/calculateInterIslandShipping'
import { useAuth } from '../../../contexts/AuthContext'
import { useSnackbar} from '../../../contexts/SnackbarContext'
import phData from '../../../data/phData.json'
import BottomActionBar from "../../../components/BottomActionBar";
import SectionWrapper from '../../../components/SectionWrapper'
import FullScreenLoader from '../../../components/FullScreenLoader'
import ConfirmDialog from '../../../components/ConfirmDialog'
import freeShippinZones from '../../../data/freeShippinZones.json'


const shopLat = 13.355346998983666 
const shopLng =  123.72596017036658
const baseFees = {SM: 100, MD: 200, LG: 300, XL: 400}
const incrementPerKm = 40

export default function Checkout() {
    const { checkoutItems, totalAmount, setAuctionCheckout, setTotalAmount, setFinalPrice, isProcessing, checkout, codCheckout } = useCheckout();
    const {auctionId, winner} = useParams()
    const {user} = useAuth()
    const {showSnackbar} = useSnackbar()
    const [paymentOption, setPaymentOption] = useState('gcash')
    const [showInfo, setShowInfo] = useState(true)
    const [checkoutConfirm, setCheckoutConfirm] = useState(false)
    const [subtotal, setSubtotal] = useState('')
    const [bidder, setBidder] = useState(null)
    const [winnerBid, setWinnerBid] = useState(null)
    const [auction, setAuction] = useState(null)
    const [auctionForShipping, setAuctionForShipping] = useState(null)
    const [loading, setLoading] = useState(false) 
    const [size, setSize] = useState('SM')
    const [shippingFee, setShippingFee] = useState(0);
    const [anyProductIsLocal, setAnyProductIsLocal] = useState(false);
    const [anyProductIsNotLocal, setAnyProductIsNotLocal] = useState(false);

    const navigate = useNavigate();

    const userAddress = `${user.address?.street}, ${user.address?.city}, ${user.address?.province}, ${user.address?.country}, ${user.address?.postalCode}`

    const region = user?.address?.region?.toString();
    const province = user?.address?.province?.toUpperCase();
    const city = user?.address?.city?.toUpperCase();

    const dataRegion = phData[region];
    const dataProvince = dataRegion?.province_list?.[province];
    const dataMunicipality = dataProvince?.municipality_list?.[city];

    const checkoutConfirmOpen = () => setCheckoutConfirm(true)
    const checkoutConfirmClose = () => setCheckoutConfirm(false)


    useEffect(() => {
        const getAuctionForShipping = async () => {
            const auctionItem = await fetchAuctions()
            const findAuction = auctionItem.find((a) => a._id === auctionId)
            setAuctionForShipping(findAuction)
            console.log('findauction', findAuction)
        }
        getAuctionForShipping()
    }, [auctionId, winner])

    const calculateShipping = () => {
        if (!city || !dataMunicipality ) return 0;

        const distance = getDistanceInKm(shopLat, shopLng, dataMunicipality.lat, dataMunicipality.lng);
        const increment = distance * incrementPerKm;
        return baseFees[size] + Math.ceil(increment);
    }

    //let shippingFee = 0;
    //let anyProductIsLocal 
    //let anyProductIsNotLocal 
    useEffect(() => {
        let localFlag, nonLocalFlag;
        let fee = 0

        if (auctionId || winner) {
            
            if (auctionForShipping?.inventoryId?.isLocal) {
                localFlag = true;
                nonLocalFlag = false;
            }
            else {
                localFlag = false;
                nonLocalFlag = true;
            }
        }
        else {
            localFlag = checkoutItems.some((item) => item.productId.isLocal)
            nonLocalFlag = checkoutItems.some((item) => !item.productId.isLocal)
        }
        
        if (user.isLocal) {
            const isFreeShipping = freeShippinZones.some(
                (zone) =>
                    zone.region === user.address?.region &&
                    zone.city === user.address?.city.toUpperCase()
            )
            if (isFreeShipping) {
                fee = 0;
                console.log("FEEEE 1", fee)
            }
            else if (localFlag && nonLocalFlag) {
                fee = calculateShipping()
                console.log("FEEEE 2", fee)
            }
            else if (localFlag && !nonLocalFlag) {
                fee = calculateShipping()
                console.log("FEEEE 3", fee)
            }
            else if (!localFlag && nonLocalFlag) {
                let totalWeight 
                if (auctionId || winner) {
                    totalWeight = auction?.inventoryId?.weight;
                    console.log("WEIGHT 1", totalWeight)
                    console.log("WEIGHT 1", auction)
                    console.log("WEIGHT 1", auction?.inventoryId)
                }
                else {
                    totalWeight = checkoutItems.reduce((sum, item) => sum + (item.productId?.weight || 0), 0);
                }

                if (totalWeight <= 5) {
                    fee = 100;
                } else if (totalWeight <= 10) {
                    fee = 200;
                } else {
                    const extraBlocks = Math.ceil((totalWeight - 10) / 5);
                    fee = 300 + extraBlocks * 100;
                } 
            }
        }
        else {
            if (localFlag && !nonLocalFlag) {
                showSnackbar('The item you are trying to buy is not available at your region', 'error')
                navigate('/cart')
                return;
            }
            else if (nonLocalFlag) {
                if (!checkoutItems?.length && !auction) return
                    let nonLocalProduct 
                if (auction || winner) {
                    nonLocalProduct = auction?.inventoryId?.isLocal
                }
                else {
                    nonLocalProduct = checkoutItems.find((item) => !item.productId.isLocal)
                }
                console.log('INSIDE non local - local products', nonLocalProduct)
                fee = calculateInterIslandShipping(nonLocalProduct.productId, user)
            }
            else {
                fee = 0
                return
            }
        }

        console.log('FEE FEE FEE', fee)
        setAnyProductIsLocal(localFlag)
        setAnyProductIsNotLocal(nonLocalFlag)
        setShippingFee(fee)

    }, [auctionForShipping, checkoutItems, auctionId, winner, user, freeShippinZones])

    console.log('SHIPPING FEE', shippingFee)
    useEffect(() => {
        const getAuctions = async () => {
            setLoading(true)
            try {
                if (!auctionId || !winner) return
                
                const auctions = await fetchAuctions()
                const matchAuction = auctions.find((a) => a._id.toString() === auctionId)
                
                if (!matchAuction) {
                    showSnackbar("Auction not found", "error");
                    navigate("/auction/listing");
                    return;
                }
                
                const bidders = await getBidders(matchAuction._id, user.token)
                const findBidder = bidders.find((b) => b.userId._id.toString() === user.userId)
                const getWinnerInfo = bidders.find((b) => b.userId._id.toString() === winner)
                const amount = getWinnerInfo.amount

                if (!winner) {
                    showSnackbar("No winner for this auction", 'warning');
                    navigate('/auction/listing');
                    return;
                }
                if (!findBidder) {
                    showSnackbar("You did not bid on this auction", 'warning');
                    navigate('/auction/listing');
                    return;
                }
                if (!getWinnerInfo) {
                    showSnackbar("Winner data not found — please refresh", 'warning');
                    navigate('/auction/listing');
                    return;
                }
                if (winner !== user.userId || getWinnerInfo.userId._id.toString() !== user.userId) {
                    showSnackbar("Only the winner can checkout this item", 'warning');
                    navigate('/auction/listing');
                    return;
                }
                
                setWinnerBid(amount)
                setBidder(findBidder)
                setAuction(matchAuction)
                setSubtotal(amount + shippingFee)
                setFinalPrice(amount + shippingFee)
                setAuctionCheckout(matchAuction)
            }
            catch (err) {
                console.error('Problem fetching auction:', err)
            }
            finally {
                setLoading(false)
            }
        }
        getAuctions()
    }, [auctionId, winner, shippingFee])

    useEffect(() => {
        if (auctionId || winner) return;
        setFinalPrice(totalAmount + shippingFee)
        setSubtotal(totalAmount + shippingFee)
    }, [auctionId, winner, totalAmount, shippingFee])

    const handleCheckout = () => {
        setLoading(true)
        try {
            if (auctionId || winner) {
                if (paymentOption === 'gcash') {
                    checkout()
                }
                else {
                    showSnackbar("Only GCash is allowed for auction items", "warning");
                    return;
                }
            }
            else {
                if (paymentOption === 'gcash') {
                    checkout()
                }
                else if (paymentOption === 'cashOnDelivery') {
                    checkoutConfirmOpen()
                }
            }
        }
        catch (err) {
            console.error('Problem occured during checkout: ', err)
        }
        finally {
            setLoading(false)
        }
    }


    if (!auctionId && !winner && !checkoutItems.length ) {
        return (
             <Container sx={{ mt: 4 }}>
                <Stack justifyContent={'center'} alignItems={'center'} height={'80vh'}>
                    <Box>
                        <img 
                            src={'/avatar-thinking-4-svgrepo-com.svg'}
                            style={{
                                display: 'block',
                                width: '150px',
                                height: '150px',
                            }}
                        />
                    </Box>
                    <Stack>
                        <Typography variant="h4" align='center'>
                            No item to checkout
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 3 }} align='center'>
                            You did not select an item yet.
                        </Typography>
                    </Stack>
                    <Button variant="contained" color='secondary' sx={{borderRadius: '999px', px: 3, display: 'flex', alignItems: 'center', gap: 1}} onClick={() => navigate('/cart')}>
                        <ChevronLeftIcon style={{color: 'white'}}/>
                        Go back to cart
                    </Button>
                </Stack>
            </Container>
        );
    }
    
    return (
        <Box sx={{bgcolor: '#f0f0f0ff', height: '100%', minHeight: '100vh', p: 2}}>
            <Stack gap={2} sx={{ pb: 10}}>
                <Stack>
                    <Typography variant="subtitle1" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        {(auctionId || winner) ? 'Auction Checkout' : 'Checkout'}
                        <ReceiptTextIcon/>
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Please review your cart items and delivery information before continuing
                    </Typography>
                </Stack>
                <Stack gap={2}>
                    <SectionWrapper>
                        <Stack gap={1}>
                            <Typography variant="body1" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <MapPinIcon/>
                                Shipping information
                            </Typography>
                            <Stack sx={{px: 1 }}>
                                <Typography variant="body2" color="gray">{user.fullName}</Typography>
                                <Typography variant="body2" color="gray">{user.email}</Typography>
                                <Typography variant="body2" color="gray">{user.phoneNumber}</Typography>
                                <Typography variant="body2" color="gray">{toTitleCase(userAddress)}</Typography>
                            </Stack>
                            <Button variant="outlined" color="secondary" onClick={() => navigate('/account/update')}>
                                Change
                            </Button>
                        </Stack>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Stack>
                            <Typography variant="subtitle2" color="initial" gutterBottom sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                <Package2Icon/>
                                {(auctionId || winner) ? 
                                    'Claimed Item'
                                    :
                                    `Total items ${checkoutItems.length}`
                                }
                            </Typography>
                            {(auctionId || winner) ?
                                <Stack 
                                    gap={1} 
                                    sx={{
                                        bgcolor: '#f5f5f5ff', 
                                        p: .5, 
                                        my: 1, 
                                        boxShadow: 4,
                                        borderRadius: 1,

                                    }}
                                >
                                    <Stack direction={'row'} sx={{borderRadius: .5, gap: 3, p: 1,}}>
                                        <Box sx={{width: 80, height: 80, overflow: 'hidden', borderRadius: 1}}>
                                            <img 
                                                src={auction?.inventoryId?.images?.[0]}
                                                style={{
                                                    display: 'block',
                                                    height: '100%',
                                                    width: '100%',
                                                    aspectRatio: '1/1',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Box>
                                        <Stack justifyContent={'space-between'}>
                                            <Typography variant="body2" color="initial">
                                                {auction?.inventoryId?.productName}
                                            </Typography>
                                            <Stack direction={'row'} gap={1}>
                                                <Typography variant="body2" color="initial" sx={{px: 1, border: '1px solid gray', borderRadius: '999px'}}>
                                                    {auction?.inventoryId?.isLocal ? 'Large' : 'Small'} item
                                                </Typography>
                                                <Divider flexItem orientation="vertical"/>
                                                <Typography variant="body2" color="initial" sx={{px: 1, border: '1px solid gray', borderRadius: '999px'}}>
                                                    {auction?.inventoryId?.condition}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" color="secondary">
                                                Php {formatNumber(auction?.reservePrice)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                :
                                <Stack gap={1} sx={{bgcolor: '#f5f5f5ff', p: 2, my: 1, borderRadius: 2}}>
                                    {checkoutItems.map((item) => (
                                        <Box key={item._id} sx={{ display: "flex", gap: 3, justifyContent: 'space-between'}}>
                                            <Box sx={{width: 80, height: 80, overflow: 'hidden', borderRadius: 1}}>
                                                <img 
                                                    src={item.productId?.images?.[0]}
                                                    style={{
                                                        display: 'block',
                                                        height: '100%',
                                                        width: '100%',
                                                        aspectRatio: '1/1',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Box>
                                            <Stack>
                                                <Typography variant="body2" color="initial" align="end">
                                                    {item.productId?.productName}
                                                </Typography>
                                                <Stack direction={'row'} gap={1}>
                                                    <Typography variant="body2" color="initial" align="end" sx={{px: 1, border: '1px solid gray', borderRadius: '999px'}}>
                                                        {item.productId?.isLocal ? 'Large' : 'Small'} item
                                                    </Typography>
                                                    <Divider flexItem orientation="vertical"/>
                                                    <Typography variant="body2" color="initial" align="end" sx={{px: 1, border: '1px solid gray', borderRadius: '999px'}}>
                                                        {item.productId?.condition}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="body2" color="secondary" align="end">
                                                    - Php {formatNumber(item.productId?.price)}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            }
                        </Stack>
                        <Divider sx={{my: 2}}/>
                        <Stack>
                            {(auctionId || winner) ?
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography variant="body2" fontWeight={'bold'} color="secondary">Your Bid:</Typography>
                                    <Typography variant="body2" fontWeight={'bold'} color="secondary">PHP {formatNumber(winnerBid)}</Typography>
                                </Stack>
                                :
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography variant="body2">Total:</Typography>
                                    <Typography variant="body2">PHP {formatNumber(totalAmount)}</Typography>
                                </Stack>
                            }
                        </Stack>
                    </SectionWrapper>
                    <SectionWrapper sx={{gap: 2}}>
                        <Stack>
                            <Stack justifyContent={'space-between'} alignItems={'center'} direction={'row'}>
                                <Typography variant="body1" color="initial" sx={{alignItems: 'center', display: 'flex', gap: 1}}>
                                    <WalletIcon/>
                                    Pay with
                                </Typography>
                                <IconButton onClick={() => setShowInfo((prev) => !prev)}>
                                    <InfoIcon style={{color: showInfo ? 'white' : 'gray', fill: showInfo ? 'gray' : 'none'}}/>
                                </IconButton>
                            </Stack>
                            <Collapse in={showInfo} mountOnEnter unmountOnExit>
                            {(auctionId || winner) ?
                                <Typography variant="body2" color="gray" gutterBottom sx={{px: 1}}>
                                    Auction items can only be bought using <b>GCash</b> as payment option
                                </Typography>
                                :
                                <Typography variant="body2" color="gray" gutterBottom sx={{px: 1}}>
                                    Local items can be purchased using Cash on Delivery or Online Payment, while international items support Online Payment only
                                </Typography>
                            }
                            </Collapse>
                        </Stack>
                        <Stack>
                            <FormControl fullWidth>
                                <InputLabel id='payment-option'>Payment options</InputLabel>
                                <Select
                                    labelId="payment-option"
                                    value={paymentOption}
                                    label='Payment option'
                                    onChange={(e) => setPaymentOption(e.target.value)}
                                >
                                    <MenuItem value='gcash'>GCash</MenuItem>
                                    {(!auctionId || !winner) &&
                                        <MenuItem value='cashOnDelivery'>Cash on Delivery</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack justifyContent={'space-between'} direction={'row'}>
                            <Typography variant="body2" color="secondary">Payment method: </Typography>
                            <Typography variant="body2" color="secondary">{paymentOption === 'cashOnDelivery' ? 'Cash on Delivery' : 'GCash'}</Typography>
                        </Stack>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Stack gap={1}>
                            <Typography variant="subtitle2" color="initial" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <BanknoteIcon/>
                                Payment details
                            </Typography>
                            {(auctionId || winner) ?
                                <Stack>
                                    <Stack>
                                        <Stack>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <Typography variant="body2" color="secondary">Item Price</Typography>
                                                <Typography variant="body2" color="secondary">- Php {formatNumber(auction?.reservePrice)}</Typography>
                                            </Stack>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <Typography variant="body2" color="secondary">Bid Difference</Typography>
                                                <Typography variant="body2" color="secondary">- Php {formatNumber(winnerBid - auction?.reservePrice)}</Typography>
                                            </Stack>
                                        </Stack>
                                        <Divider sx={{my: 1}}/>
                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                            <Typography variant="body2" color="secondary">Total Bid</Typography>
                                            <Typography variant="body2" color="secondary">- Php {formatNumber(winnerBid)}</Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack justifyContent={'space-between'} direction={'row'}>
                                        <Typography variant="body2" color="secondary">Shipping Fee</Typography>
                                        <Typography variant="body2" color={shippingFee <= 0 ? 'success' : "secondary"} fontWeight={shippingFee <= 0 ? 'bold' : 'none'}>{ shippingFee <= 0 ? 'FREE' : `- Php ${shippingFee}`}</Typography>
                                    </Stack>
                                    <Divider sx={{my: 2}}/>
                                    <Stack justifyContent={'space-between'} direction={'row'}>
                                        <Typography variant="body2" color="secondary" fontWeight={'bold'}>Subtotal</Typography>
                                        <Typography variant="body2" color="secondary" fontWeight={'bold'}>Php {formatNumber(subtotal)}</Typography>
                                    </Stack>
                                </Stack>
                                :
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <Typography variant="body2" color="secondary">Item(s) Subtotal</Typography>
                                        <Typography variant="body2" color="secondary">- Php {formatNumber(totalAmount)}</Typography>
                                    </Stack>
                                    <Stack justifyContent={'space-between'} direction={'row'}>
                                        <Typography variant="body2" color="secondary">Shipping Fee</Typography>
                                        <Typography variant="body2" color={shippingFee <= 0 ? 'success' : "secondary"} fontWeight={shippingFee <= 0 ? 'bold' : 'none'}>{ shippingFee <= 0 ? 'FREE' : `- Php ${shippingFee}`}</Typography>
                                    </Stack>
                                    <Divider sx={{my: 2}}/>
                                    <Stack justifyContent={'space-between'} direction={'row'}>
                                        <Typography variant="body2" color="secondary" fontWeight={'bold'}>Subtotal</Typography>
                                        <Typography variant="body2" color="secondary" fontWeight={'bold'}>Php {formatNumber(subtotal)}</Typography>
                                    </Stack>
                                </Stack>
                            }
                        </Stack>
                    </SectionWrapper>
                </Stack>
            </Stack>
            <BottomActionBar>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Button
                        color="secondary"
                        onClick={() => navigate("/cart")}
                        sx={{ p: 0, height: 50 }}
                        disabled ={isProcessing}
                    >
                        <ChevronLeftIcon fontSize="large" />
                    </Button>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} color="secondary">
                            PHP {formatNumber(subtotal)}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCheckout}
                            disabled={ loading || isProcessing}
                            sx={{ p: 1, px: 4}}
                        >
                            {isProcessing ? "Processing..." : "Checkout"}
                        </Button>
                    </Box>
                </Box>
            </BottomActionBar>
            <FullScreenLoader open={loading}/>
            <ConfirmDialog
                open={checkoutConfirm}
                title="Confirm Checkout?"
                content={`You’re about to place your order. Are you sure you want to purchase the selected item(s)?`}
                confirmText="Yes, Continue"
                cancelText="No, Go Back"
                color="success"
                onConfirm={() => codCheckout()}
                onCancel={checkoutConfirmClose}
            />
        </Box>
    );
}
