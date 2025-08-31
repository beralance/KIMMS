import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Cancel() {
    const navigate = useNavigate();
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
