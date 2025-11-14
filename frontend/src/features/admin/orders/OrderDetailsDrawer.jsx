// AddItemDrawer.js
import * as React from "react";
import {
  Drawer,
  Box,
  Typography, 
  IconButton,
  Button,
  Stack,
  CircularProgress,
  Divider,
  Collapse,
  Tooltip,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StatusStepper from './StatusStepper'
import { OrderContext } from "../../../contexts/OrderContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import SectionWrapper from "../../../components/SectionWrapper";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { BoxIcon, ChevronDownIcon, ChevronRightIcon, ChevronsRightIcon, ContactIcon, CopyCheckIcon, CopyIcon, Divide, MapIcon, MapPinHouseIcon, MapPinnedIcon, PhoneIcon, PrinterIcon } from "lucide-react";
import { toTitleCase, formatNumber } from "../../../utils/stringUtils";
import { getUserLatestLocation } from "../../../utils/locationApi";
import {generateOrderSlip} from "../../../utils/printReceipt";
import dayjs from 'dayjs'


const statusSwitch = {
    pending: {next: 'confirmed', label: 'Confirm',},
    confirmed: {next: 'processing', label: 'Processing'},
    processing: {next: 'out_for_delivery', label: 'Out for Delivery'},
    out_for_delivery: {next: 'delivered', label: 'Delivered'},
    delivered: {next: null, label: 'Order Completed'},
}
export default function OrderDetailsDrawer({open, onClose, orderData}) {
    const {updateOrderStatus, cancelOrder, orders} = React.useContext(OrderContext)
    const {showSnackbar} = useSnackbar()
    const [status, setStatus] = React.useState(orderData?.purchaseStatus)
    const [disabled, setDisabled] = React.useState(false)
    const [totalUserOrder, setTotalUserOrder] = React.useState([])
    const [userDetectedLocation, setUserDetectedLocation] = React.useState('')
    const [loading, setLoading] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [openCancel, setOpenCancel] = React.useState(false);
    const [openCancelConfirm, setOpenCancelConfirm] = React.useState(false);

    const email = orderData?.userId?.email
    const address = orderData?.userId?.address
    const shippingAddress = `${address.street}, ${address.city}, ${address.province}, ${address.region}, ${address.postalCode}, ${address.country}`
    const filteredEmail = email?.replace(/@.*/, '')
    const current = statusSwitch[status];


    const handleCancelOpen = () => setOpenCancelConfirm(true)
    const handleCancelClose = () => setOpenCancelConfirm(false)


    const flaggedItems = orderData?.products?.filter(
        (product) => product.productId?.isLocal && !orderData.userId?.isLocal
    )
    const hasLocalRestriction = flaggedItems?.length > 0;

    React.useEffect(() => {
        const getUserOrders = async () => {
            const userOrder = await orders.filter(o => o.userId._id === orderData?.userId?._id)
            setTotalUserOrder(userOrder)

            const detectedAddress = await getUserLatestLocation(orderData?.userId?._id)
            const address = `${detectedAddress?.latest?.fullAddress?.address?.state}, ${detectedAddress?.latest?.fullAddress?.address?.region}, ${detectedAddress?.latest?.fullAddress?.address?.postcode}, ${detectedAddress?.latest?.fullAddress?.address?.country_code.toUpperCase()}`
            console.log('detected', address)
            setUserDetectedLocation(address)
        }
        getUserOrders()
    }, [orderData])

    const handleCancelOrder = async (orderId) => {
        if (!orderData?._id) return
        setLoading(true)

        try {
            const result = await cancelOrder(orderId)

            if (result.error) {
                showSnackbar('Cancel failed:', 'warning')
                return
            }
            showSnackbar('Order has been cancelled successfully:', 'success')
            onClose?.()
        }
        catch (err) {
            console.error('Problem occured when cancelling order:', err)
        }
        finally {
            setLoading(false)
        }
    }

    const handleClick = async ({orderId}) => {
        if (!current?.next) return;

        setLoading(true)
        setDisabled(true);

        try {
        
            const success = await updateOrderStatus(orderId, current.next)

            if (success) {
                setStatus(current.next)
                console.log(`DB ORDER(${orderId}) STATUS UPDATED TO: ${current.next}`)    
            }
            else {
                console.log('Failed to update status in Orders collection')
            }
        }
        catch (err) {
            console.error('Error updating status: ', err)
        }
        finally {
            setLoading(false)
            if (status === 'out_for_delivery') {
                setDisabled(false)                
            }
            else {
                setTimeout(() => {
                    setDisabled(false);
                }, 10000);
            }
        }
    }


    return (
        <Drawer anchor="bottom" open={open} onClose={onClose} sx={{ position: 'relative', width: "100%", display: {xs: 'block', md: 'none'}, }} PaperProps={{sx: {height: '90vh'}}}>
            <IconButton onClick={onClose} sx={{position: 'absolute', top: 5, right: 5}}>
                <CloseIcon sx={{color: 'gray'}}/>
            </IconButton>
            <Stack gap={3} sx={{ p: 2, bgcolor: '#f0f0f0'}}>
                <Stack>
                    <Typography variant="subtitle1" color="secondary">
                        Order Details
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Review order information and update purchase status
                    </Typography>
                </Stack>

                {/*Purchase Status Tracker*/}
                <SectionWrapper sx={{gap: 3}}>
                    <Stack>
                        <Typography variant="subtitle2" color="initial">Purchase Status</Typography>
                        <Typography variant="body2" color="gray">Current status for order <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>{orderData.orderId}</span> is "<b>{orderData.purchaseStatus.toUpperCase()}</b>"</Typography>
                    </Stack>
                    <StatusStepper orderStatus={status}/>
                </SectionWrapper>

                {/*Order Actions*/}
                <SectionWrapper sx={{gap: 2}}>
                    <Stack gap={2}>
                        <Stack>
                            <Typography variant="subtitle2" color="initial">Order Actions</Typography>
                            <Typography variant="body2" color="gray">Manage order lifecycle including status updates, cancellation, and print records</Typography>
                        </Stack>
                        <Stack direction={'row'} gap={1}>
                            <Button variant={disabled ? 'text' : "contained"} fullWidth color="secondary" sx={{py: 1}} onClick={() => handleClick({orderId: orderData._id})}
                                disabled={disabled || !current?.next}    
                            >
                                {loading ?
                                    'Updating status...'
                                    :
                                    disabled ?
                                        <Typography variant="body" color="grey">
                                            Please wait 10 seconds for another update...   
                                        </Typography>
                                        :
                                        <Stack direction={'row'} alignItems={'center'} gap={1}>
                                            <Typography variant="body2" fontWeight={'bold'} color="white">{status === 'delivered' ? '' : toTitleCase(status)}</Typography>
                                            <Typography variant="body2" color="secondary" sx={{display: 'flex', alignContent: 'center'}}>{status === 'delivered' ? '' : <ChevronsRightIcon style={{color: 'white'}}/>}</Typography>
                                            <Typography variant="body2" fontWeight={'bold'} sx={{borderRadius: '999px', bgcolor: 'rgba(255, 255, 255, 0.2)', px: 1.2, py: .4}} color="rgba(0, 199, 0, 1)">{toTitleCase(current?.label) || 'DONE'}</Typography>
                                        </Stack>
                                }
                            </Button>
                            {(orderData?.purchaseStatus === 'confirmed' || orderData?.purchaseStatus === 'processing') &&
                                <Stack direction={'row'} gap={1} alignItems={'center'}>
                                    <Button
                                        sx={{height: '100%',}}
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                            const commands = generateOrderSlip(orderData)
                                            console.log('ESC/POS Commands:', commands)
                                            showSnackbar('Order slip generated!', 'success')
                                            
                                        }}
                                    >
                                        <PrinterIcon style={{color: 'white', strokeWidth: 2,}}/>
                                    </Button>
                                </Stack>
                            }
                        </Stack>
                        {(orderData?.purchaseStatus === 'pending' || orderData?.purchaseStatus === 'confirmed') &&
                            <Stack gap={1}>
                                <Stack direction={'row'} mt={1} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography variant="body2" color="secondary" sx={{textDecoration: 'underline'}}>Cancel this order?</Typography>
                                    <IconButton onClick={() => setOpenCancel((prev) => !prev)}>
                                        { openCancel ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                                    </IconButton>
                                </Stack>
                                <Collapse in={openCancel} mountOnEnter unmountOnExit>
                                    <Button variant={"outlined"} fullWidth color="warning" onClick={() => handleCancelOpen()}>
                                        <Typography variant="body" color="warning">
                                            Cancel Order
                                        </Typography>
                                    </Button>
                                </Collapse>
                            </Stack>
                        }
                    </Stack>

                </SectionWrapper>
                <Divider>
                    <Typography variant="body2" color="gray">
                        Order Info
                    </Typography>
                </Divider>

                {/*Order info*/}
                <SectionWrapper>
                    <Stack gap={2}>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body1" color="secondary" fontWeight={'bold'}>Order ID: </Typography>
                            <Stack direction={'row'} gap={1} alignItems={'center'}>
                                <Typography variant="body2" color="initial">
                                    {orderData.orderId || ''}
                                </Typography>
                                <Tooltip title='Copy Order ID'>
                                        <IconButton 
                                            size='small' 
                                            onClick={() => {
                                                navigator.clipboard.writeText(orderData.orderId || '');
                                                setCopied(true);
                                                setTimeout(() => {
                                                    setCopied(false)
                                                }, 2000);
                                            }}
                                        >
                                            {copied ? <CopyCheckIcon style={{color: 'green'}}/> : <CopyIcon/>}
                                        </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>
                        <Divider/>
                        
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">Order Type :</Typography>
                            <Typography variant="body2" color="secondary">{toTitleCase(orderData?.orderType)} order</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">Payment method :</Typography>
                            <Typography variant="body2" color="secondary">{orderData?.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'} </Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">Payment Status :</Typography>
                            <Typography variant="body2" color="secondary">{orderData?.paymentStatus.toUpperCase()}</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">Subtotal :</Typography>
                            <Typography variant="body2" color="secondary">Php {formatNumber(orderData?.totalPrice)}</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">Grand Total :</Typography>
                            <Typography variant="body2" color="secondary">Php {formatNumber(orderData?.finalPrice)}</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">Order Placed At :</Typography>
                            <Typography variant="body2" color="secondary">{dayjs(orderData?.createdAt).format('MMMM, D YYYY | hh:m A')}</Typography>
                        </Stack>
                        
                        {(orderData?.transactionReference || orderData?.paymentStatus === 'paid') &&
                            <>
                                <Divider>
                                    <Typography variant="body2" color="gray">Payment Info</Typography>
                                </Divider>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography variant="body2" color="secondary">Transaction Ref. :</Typography>
                                    <Typography variant="body2" color="secondary">{orderData?.transactionReference}</Typography>
                                </Stack>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography variant="body2" color="secondary">Session Id. :</Typography>
                                    <Typography variant="body2" color="secondary">{orderData?.checkoutSessionId}</Typography>
                                </Stack>
                            </>
                        }
                    </Stack>
                </SectionWrapper>
                <Divider>
                    <Typography variant="body2" color="gray">
                        User Info
                    </Typography>
                </Divider>

                {/*User info*/}
                <SectionWrapper>
                    <Stack gap={3}>
                        <Stack gap={3} direction={'row'} alignItems={'center'}>
                            <Box sx={{borderRadius: '999px', boxShadow: 4, width: 80, height: 80, overflow: 'hidden'}}>
                                <img 
                                    src={orderData.userId.avatar}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        aspectRatio: '1/1'
                                    }}
                                />
                            </Box>
                            <Stack>
                                <Typography variant="body1" color="secondary" fontWeight={'bold'}>{orderData.userId.fullName}</Typography>
                                <Typography variant="body2" color="gray">{orderData.userId.email}</Typography>
                            </Stack>
                        </Stack>
                        <Divider/>
                        <Stack gap={2}>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body2" color="gray" sx={{display: 'flex', alignItems: 'center', gap: 1}}><PhoneIcon/> Phone number : </Typography>
                                <Typography variant="body2" color="secondary">{orderData.userId.phoneNumber}</Typography>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body2" color="gray" sx={{display: 'flex', alignItems: 'center', gap: 1}}><MapIcon/> Local/International :</Typography>
                                <Typography variant="body2" color="secondary">{orderData.userId.isLocal ? 'Local' : 'International'}</Typography>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body2" color="gray" sx={{display: 'flex', alignItems: 'center', gap: 1}}><ContactIcon/> Member Since : </Typography>
                                <Typography variant="body2" color="secondary">{dayjs(orderData?.userId.createdAt).format('MMMM YYYY')}</Typography>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body2" color="gray" sx={{display: 'flex', alignItems: 'center', gap: 1}}><BoxIcon/> Previous Orders : </Typography>
                                <Typography variant="body2" color="secondary">{totalUserOrder.length}</Typography>
                            </Stack>
                            <Stack sx={{bgcolor: '#f0f0f0', p: 2, borderRadius: 1,}} gap={1}>
                                <Stack justifyContent={'space-between'}>
                                    <Typography variant="body2" color="gray" sx={{display: 'flex', alignItems: 'center', gap: 1}}><MapPinHouseIcon/> Shipping Address : </Typography>
                                    <Typography variant="body2" color="secondary" sx={{p: 1,}}>{toTitleCase(shippingAddress)}</Typography>
                                </Stack>
                                <Stack direction={'row'}  justifyContent={'space-between'} >
                                    <Typography variant="body2" color="gray" sx={{display: 'flex', alignItems: 'center', gap: 1}}><MapPinnedIcon/> Detected : </Typography>
                                    <Typography variant="body2" color={address.region === '05' ? 'success' : 'warning'} fontWeight={'bold'}>{userDetectedLocation}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        {hasLocalRestriction && 
                            <>
                                <Stack justifyContent={'space-between'}>
                                    <Typography variant="body2" color="secondary" fontWeight={'bold'}>Notice:</Typography>
                                    <Typography variant="body2" color="warning" sx={{bgcolor: '#ff910036', p: 1}}>User order includes large item which can't be available for shipment</Typography>
                                </Stack>
                            </>
                        }
                    </Stack>
                </SectionWrapper>
                <Divider>
                    <Typography variant="body2" color="gray">
                        Product Info
                    </Typography>
                </Divider>

                {/*Product info*/}
                <SectionWrapper sx={{gap: 2}}>
                    <Typography variant="subtitle2" color="secondary">Items ordered ({orderData?.products.length})</Typography>
                    <Grid container spacing={2}>
                        {orderData.products.map((product) => 
                            <Grid key={product.productId._id} size={{xs: 12}}>
                                <Grid container spacing={1}>
                                    <Grid size={{xs: 5}}>
                                        <Box height={200} width={150}>
                                            <img 
                                                src={product.productId?.images[0]}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid size={{xs: 7}}>
                                        <Stack p={1} gap={1}>
                                            <Stack>
                                                <Typography variant="body2" fontWeight={'bold'} color="secondary">{product.productId?.productName}</Typography>
                                                <Typography variant="body2" color="secondary">Php {formatNumber(product.productId?.price)}</Typography>
                                            </Stack>
                                            <Divider/>
                                            <Stack direction={'row'} flexWrap={'wrap'}>
                                                <Typography variant="body2" color="secondary" sx={{borderRadius: '999px', border: '1px solid gray', px: 1}}>{product.productId?.category?.name}</Typography>
                                                <Divider flexItem orientation="vertical" sx={{mx: 1}}/>
                                                <Typography variant="body2" color="secondary" sx={{borderRadius: '999px', border: '1px solid gray', px: 1}}>{toTitleCase(product.productId?.condition)}</Typography>
                                            </Stack>
                                            <Typography variant="body2" color="secondary" sx={{borderRadius: '999px', border: '1px solid gray', px: 1,}} align="center">{product.productId?.isLocal ? 'Large' : 'Small'} item</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </SectionWrapper>
            </Stack>
            <ConfirmDialog
                open={openCancelConfirm}
                title="Cancel Order?"
                content={`Are you sure you want to cancel ${orderData?.userId?.fullName}'s order?`}
                onConfirm={() => handleCancelOrder(orderData?._id)}
                onCancel={() => handleCancelClose()}
                color="error"
                confirmText="Yes, Cancel Order"
                cancelText="No"
            />
        </Drawer>
    );
}
