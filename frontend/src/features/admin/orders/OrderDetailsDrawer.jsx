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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StatusStepper from './StatusStepper'
import { OrderContext } from "../../../contexts/OrderContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { ChevronsRightIcon, PrinterIcon } from "lucide-react";
import { toTitleCase, formatNumber } from "../../../utils/stringUtils";
import {generateOrderSlip} from "../../../utils/printReceipt";
import dayjs from 'dayjs'


const statusSwitch = {
    pending: {next: 'confirmed', label: 'Confirm'},
    confirmed: {next: 'processing', label: 'Processing'},
    processing: {next: 'out_for_delivery', label: 'Out for Delivery'},
    out_for_delivery: {next: 'delivered', label: 'Delivered'},
    delivered: {next: null, label: 'Order Completed'},
}
export default function OrderDetailsDrawer({open, onClose, orderData}) {
    const {updateOrderStatus} = React.useContext(OrderContext)
    const {showSnackbar} = useSnackbar()
    const [status, setStatus] = React.useState(orderData.purchaseStatus)
    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false);

    const email = orderData.userId?.email
    const address = orderData.userId?.address
    const filteredEmail = email.replace(/@.*/, '')

    const current = statusSwitch[status];

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
            <Box sx={{position: 'absolute', top: 5, right: 5}}>
                <IconButton onClick={onClose}>
                    <CloseIcon sx={{color: 'gray'}}/>
                </IconButton>
            </Box>
            <Stack sx={{ mt: 1, p: 1}}>
                <Stack sx={{mb: 2}}>
                    <Typography variant="h6" color="secondary">
                        {filteredEmail}
                    </Typography>
                </Stack>
                <Stack>
                    <StatusStepper orderStatus={status}/>
                </Stack>
                <Divider/>
                <Stack sx={{p: 2}}>
                    <Typography variant="body1" color="secondary" fontWeight={'bold'}>Order Information</Typography>
                    {orderData.products.map(product => {
                        <Stack key={product._id}>
                            <Typography variant="body1" color="initial">{product.productName}</Typography>
                        </Stack>
                    })}
                    <Typography variant="body1" color="initial">{orderData.auctionId}</Typography>
                    <Typography variant="body1" color="initial">{orderData.orderType}</Typography>
                    <Typography variant="body1" color="initial">{orderData.checkoutSessionId}</Typography>
                    <Typography variant="body1" color="initial" fontWeight={'bold'}>{orderData.orderId}</Typography>
                    <Typography variant="body1" color="initial">{orderData.transactionReference}</Typography>
                    <Typography variant="body1" color="initial">{orderData.paymentMethod}</Typography>
                    <Typography variant="body1" color="initial">{orderData.totalPrice}</Typography>
                    <Typography variant="body1" color="initial">{orderData.paymentStatus}</Typography>
                    <Typography variant="body1" color="initial">{orderData.purchaseStatus}</Typography>
                    <Typography variant="body1" color="initial">{dayjs(orderData.createdAt).format('MMMM D, YYYY')}</Typography>
                    <Typography variant="body1" color="initial">{dayjs(orderData.createdAt).format('h:mm A')}</Typography>
                    <Typography variant="body1" color="initial">{orderData.userId?.email}</Typography>
                    <Stack direction={'row'}>
                        <Typography variant="body1" color="initial">
                            {`
                                ${address.region},
                                ${address.province},
                                ${address.city},
                                ${address.street},
                                ${address.country}
                                ${address.postalCode}
                            `}
                        </Typography>
                    </Stack>
                    <Typography variant="body1" color="initial">{orderData.userId?.number}</Typography>
                    <Typography variant="body1" color="initial">{orderData.userId?.isLocal}</Typography>
                    <Typography variant="body1" color="initial">{orderData.userId?.fullName}</Typography>
                    <Box>
                        <img 
                            src={orderData.userId?.avatar} 
                            alt={`${filteredEmail}-avatar`} 
                            style={{
                                width: '40px',
                                height: '40px',
                                aspectRatio: '1/1',
                                display: 'block',
                            }}
                        />
                    </Box>
                </Stack>
                {(orderData.purchaseStatus === 'confirmed' || orderData.purchaseStatus === 'processing') &&
                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                        <Typography variant="body1" color="initial">Print Receipt</Typography>
                        <IconButton onClick={() => {
                            const commands = generateOrderSlip(orderData)
                            console.log('ESC/POS Commands:', commands)
                            showSnackbar('Order slip generated!', 'success')
                            
                        }}>
                            <PrinterIcon/>
                        </IconButton>
                    </Stack>
                }
                <Button variant={disabled ? 'text' : "outlined"} sx={{mx: 4, my: 2}} color="secondary" onClick={() => handleClick({orderId: orderData._id})}
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
                                <Typography variant="body2" color="grey">{status === 'delivered' ? '' : toTitleCase(status)}</Typography>
                                <Typography variant="body2" color="secondary" sx={{display: 'flex', alignContent: 'center'}}>{status === 'delivered' ? '' : <ChevronsRightIcon/>}</Typography>
                                <Typography variant="body2" color="success">{toTitleCase(current?.label) || 'DONE'}</Typography>
                            </Stack>
                    }
                </Button>
            </Stack>
        </Drawer>
    );
}
