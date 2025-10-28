import { Box, Stack, Typography } from '@mui/material'
import {} from '@mui/icons-material'



const PaymentMethod = () => {
    
    
    return (
        <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="body2" color="secondary">Shipping fee:</Typography>
            <Typography variant="body2" color="secondary">PHP {shippingFee}</Typography>
        </Stack>
    )
}

export default PaymentMethod
