import React, { useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Cancel() {
    const navigate = useNavigate();

    const checkoutSessionId = localStorage.getItem('checkoutSessionId')//pass session_id in URL
    console.log('This is the checkout session id from local storage: ', checkoutSessionId)
    useEffect(() => {
        if (!checkoutSessionId) return;

        fetch('http://localhost:5000/api/payment/cancel', {
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
            <Typography variant="h4" gutterBottom>
                Payment Cancelled
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Your payment was not completed.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/cart')}>
                Back to Checkout
            </Button>
        </Container>
    );
}
