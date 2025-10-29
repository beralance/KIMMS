import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Divider, Stack, FormControl, InputLabel, Select, MenuItem, IconButton, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../../contexts/CheckoutContext";
import { BanknoteIcon, ChevronLeftIcon, InfoIcon, MapPinIcon, Package2Icon, PackageOpenIcon, ReceiptTextIcon, WalletIcon} from 'lucide-react'
import { toTitleCase, formatNumber} from '../../../utils/stringUtils'
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
    const { checkoutItems, totalAmount, setFinalPrice, isProcessing, checkout, codCheckout } = useCheckout();
    const {user} = useAuth()
    const {showSnackbar} = useSnackbar()
    const [paymentOption, setPaymentOption] = useState('gcash')
    const [showInfo, setShowInfo] = useState(true)
    const [checkoutConfirm, setCheckoutConfirm] = useState(false)
    const [loading, setLoading] = useState(false) 
    const [size, setSize] = useState('SM')
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

    const calculateShipping = () => {
        if (!city || !dataMunicipality ) return 0;

        const distance = getDistanceInKm(shopLat, shopLng, dataMunicipality.lat, dataMunicipality.lng);
        const increment = distance * incrementPerKm;
        return baseFees[size] + Math.ceil(increment);
    }

    let shippingFee = 0;

    const anyProductIsLocal = checkoutItems.some((item) => item.productId.isLocal)
    const anyProductIsNotLocal = checkoutItems.some((item) => !item.productId.isLocal)

    if (user.isLocal) {
        const isFreeShipping = freeShippinZones.some(
            (zone) =>
                zone.region === user.address?.region &&
                zone.city === user.address?.city.toUpperCase()
        )
        if (isFreeShipping) {
            shippingFee = 0;
        }
        else if (anyProductIsLocal && anyProductIsNotLocal) {
            shippingFee = calculateShipping()
        }
        else if (anyProductIsLocal && !anyProductIsNotLocal) {
            shippingFee = calculateShipping()
        }
        else if (!anyProductIsLocal && anyProductIsNotLocal) {
            const totalWeight = checkoutItems.reduce((sum, item) => sum + (item.productId?.weight || 0), 0);

            if (totalWeight <= 5) {
                shippingFee = 100;
            } else if (totalWeight <= 10) {
                shippingFee = 200;
            } else {
                const extraBlocks = Math.ceil((totalWeight - 10) / 5);
                shippingFee = 300 + extraBlocks * 100;
            } 
        }
    }
    else {
        if (anyProductIsLocal && !anyProductIsNotLocal) {
            showSnackbar('The item you are trying to buy is not available at your region', 'error')
            navigate('/cart')
            return;
        }
        else if (anyProductIsNotLocal) {
            console.log('INSIDE non local')
            const nonLocalProduct = checkoutItems.find((item) => !item.productId.isLocal)
            console.log('INSIDE non local - local products', nonLocalProduct)
            shippingFee = calculateInterIslandShipping(nonLocalProduct.productId, user)
        }
        else {
            shippingFee = 0
            return
        }
    }

    console.log('checkoutItems', checkoutItems)
    const finalAmount = totalAmount + shippingFee;
    setFinalPrice(finalAmount)


    const handleCheckout = () => {
        try {
            setLoading(true)
            if (paymentOption === 'gcash') {
                checkout()
            }
            else if (paymentOption === 'cashOnDelivery') {
                checkoutConfirmOpen()
            }
        }
        catch (err) {
            console.error('Problem occured during checkout: ', err)
        }
        finally {
            setLoading(false)
        }
    }

    if (!checkoutItems.length) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography>No items selected</Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/cart")}>
                    Back to Cart
                </Button>
            </Container>
        );
    }
    
    return (
        <Box sx={{bgcolor: '#f0f0f0ff', height: '100%', minHeight: '100vh', p: 2}}>
            <Stack gap={2} sx={{ pb: 10}}>
                <Stack>
                    <Typography variant="subtitle1" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        Checkout
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
                                Total items {`(${checkoutItems.length})`}
                            </Typography>
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
                                            <Typography variant="body2" color="initial" align="end">
                                                {item.productId?.condition}
                                            </Typography>
                                            <Typography variant="body2" color="secondary" align="end">
                                                - Php {formatNumber(item.productId?.price)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                        <Divider sx={{my: 2}}/>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2">Total:</Typography>
                            <Typography variant="body2">PHP {formatNumber(totalAmount)}</Typography>
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
                                <Typography variant="body2" color="gray" gutterBottom sx={{px: 1}}>
                                    Local items can be purchased using Cash on Delivery or Online Payment, while international items support Online Payment only
                                </Typography>
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
                                    <MenuItem value='cashOnDelivery'>Cash on Delivery</MenuItem>
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
                            <Stack>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography variant="body2" color="secondary">Item(s) Subtotal</Typography>
                                    <Typography variant="body2" color="secondary">- Php {formatNumber(totalAmount)}</Typography>
                                </Stack>
                                <Stack justifyContent={'space-between'} direction={'row'}>
                                    <Typography variant="body2" color="secondary">Shipping Subtotal</Typography>
                                    <Typography variant="body2" color="secondary">- Php {shippingFee}</Typography>
                                </Stack>
                                <Divider sx={{my: 2}}/>
                                <Stack justifyContent={'space-between'} direction={'row'}>
                                    <Typography variant="body2" color="secondary" fontWeight={'bold'}>Shipping Subtotal</Typography>
                                    <Typography variant="body2" color="secondary" fontWeight={'bold'}>Php {formatNumber(finalAmount)}</Typography>
                                </Stack>
                            </Stack>
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
                            PHP {formatNumber(finalAmount)}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCheckout}
                            disabled={isProcessing}
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
                title="Proceed to Checkout?"
                content="You’re about to place your order. Continue?"
                confirmText="Yes, Continue"
                cancelText="No, Go Back"
                onConfirm={() => codCheckout()}
                onCancel={checkoutConfirmClose}
            />
        </Box>
    );
}
