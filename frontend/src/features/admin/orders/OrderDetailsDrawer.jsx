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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StatusStepper from './StatusStepper'
import { OrderContext } from "../../../contexts/OrderContext";
import { ChevronsRightIcon } from "lucide-react";
import { toTitleCase } from "../../../utils/stringUtils";

const statusSwitch = {
    pending: {next: 'confirmed', label: 'Confirm'},
    confirmed: {next: 'processing', label: 'Processing'},
    processing: {next: 'out_for_delivery', label: 'Out for Delivery'},
    out_for_delivery: {next: 'delivered', label: 'Delivered'},
    delivered: {next: null, label: 'Order Completed'},
}
export default function OrderDetailsDrawer({open, onClose, orderData}) {
    const {updateOrderStatus} = React.useContext(OrderContext)
    const [status, setStatus] = React.useState(orderData.purchaseStatus)
    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false);

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
            <Stack sx={{ mt: 5}}>
                <StatusStepper orderStatus={status}/>
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
