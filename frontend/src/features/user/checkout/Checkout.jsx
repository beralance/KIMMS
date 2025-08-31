// pages/Checkout.jsx
import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../../contexts/CheckoutContext';
import axios from 'axios';

export default function Checkout() {
    const { checkoutItems } = useCheckout();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!checkoutItems.length) {
        return (
        <Container sx={{ mt: 4 }}>
            <Typography>No items selected</Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/cart')}>
                Back to Cart
            </Button>
        </Container>
        );
    }

    const totalPrice = checkoutItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const totalInCentavos = totalPrice * 100; // PayMongo expects centavos

    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleCheckout = async () => {
        if (!checkoutItems.length) return;

        try {
            setIsProcessing(true);

            const resp = await axios.post(`${backend}/api/create-checkout-session`, { amount: totalInCentavos });
            const checkoutUrl = resp.data.checkout_url;

            if (checkoutUrl) {
                localStorage.setItem('pendingPurchase', JSON.stringify(checkoutItems))
                window.location.href = checkoutUrl; // redirect to PayMongo
            } else {
                console.error('No checkout_url returned from server:', resp.data);
                alert('Failed to create checkout session. Please try again.');
            }
        }
        catch (err) {
            console.error(err.response?.data || err.message);
            alert('Could not create checkout session. Check console for details.');
        } 
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Checkout
            </Typography>

            {checkoutItems.map(item => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{item.name} x {item.quantity}</Typography>
                <Typography>PHP {(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
            ))}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">PHP {totalPrice.toFixed(2)}</Typography>
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={isProcessing}
                sx={{ mt: 3 }}
            >
                {isProcessing ? 'Processing...' : `Pay PHP ${totalPrice.toFixed(2)}`}
            </Button>

            <Button
                variant="outlined"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => navigate('/cart')}
            >
                Back to Cart
            </Button>
        </Container>
    );
}
