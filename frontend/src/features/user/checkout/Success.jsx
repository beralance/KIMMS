import React, { useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useCheckout } from '../../../contexts/CheckoutContext';

export default function Success() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { refreshCart } = useCart();
    const { checkoutItems } = useCheckout();

    const handleBack = () => {
        navigate('/'); // back to shop
    };

    useEffect(() => {
        const clearPurchased = async () => {
            const order = JSON.parse(localStorage.getItem('pendingPurchase')); // ✅ fix typo
            if (!order) {
                console.log('⚠️ No pendingPurchase found in localStorage.');
                return;
            }

            const purchasedIds = order.products.map(p => p.productId);
            console.log("🟡 Sending request to clear purchased items...", purchasedIds);

            try {
                const res = await fetch("http://localhost:5000/api/cart/remove-purchased", {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json" // ✅ important
                    },
                    body: JSON.stringify({ removeIds: purchasedIds }),
                });

                const data = await res.json();
                console.log("✅ Response from server:", data);

                localStorage.removeItem('pendingPurchase'); // ✅ cleanup
                refreshCart();
            }
            catch (err) {
                console.error("❌ Failed to clear purchased items", err);
            }
        };

        if (token) {
            clearPurchased(); // only run if logged in
        }
    }, [token]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Payment Successful!
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Thank you for your purchase.
            </Typography>
            <Button variant="contained" onClick={handleBack}>
                Back to Shop
            </Button>
        </Container>
    );
}
