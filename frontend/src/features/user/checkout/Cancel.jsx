import React, { useEffect } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Cancel() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const checkoutSessionId = localStorage.getItem('checkoutSessionId')//pass session_id in URL
    console.log('This is the checkout session id from local storage: ', checkoutSessionId)
    useEffect(() => {
        if (!checkoutSessionId) return;

        fetch(`${API_URL}/api/payment/cancel`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({checkoutSessionId}),
        })
        .then(res => res.json())
        .then(data => {
            console.log('Payment cancelled', data)

            // clear local storage once ancelled
            //localStorage.removeItem('checkoutSessionId')
            //localStorage.removeItem('pendingPurchase')
        })
    }, [checkoutSessionId])


    return (
        <Container sx={{ mt: 4 }}>
            <Stack alignItems={'center'} justifyContent={'center'} height={'80vh'}>
                <Box sx={{mb: 1}}>
                    <img 
                        src={'/shocked-shock.svg'}
                        style={{
                            display: 'block',
                            width: '80px',
                            height: '80px',
                            opacity: '0.8'
                        }}
                    />
                </Box>
                <Stack>
                    <Typography variant="h4" align='center'>
                        Payment Cancelled
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 3 }} align='center'>
                        Your order was not completed.
                    </Typography>
                </Stack>
                <Button variant="contained" color='secondary' sx={{borderRadius: '999px', px: 3}} onClick={() => navigate('/cart')}>
                    Go back to cart
                </Button>
            </Stack>
        </Container>
    );
}
