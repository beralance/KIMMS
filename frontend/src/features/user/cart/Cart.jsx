// pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Checkbox } from "@mui/material";
import { useCart } from "../../../contexts/CartProvider";
import { useCheckout } from "../../../contexts/CheckoutContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { setCheckoutItems } = useCheckout();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Update total price whenever selected items change
    useEffect(() => {
        const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
        const total = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
    }, [selectedIds, cartItems]);

    if (!cartItems.length) return <Typography>Your cart is empty</Typography>;

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCheckout = () => {
        if (!selectedIds.length) {
            alert("Please select at least one item to checkout.");
            return;
        }
        const itemsToCheckout = cartItems.filter(item => selectedIds.includes(item.id));
        setCheckoutItems(itemsToCheckout); // save to context
        navigate("/checkout", {replace: true}); // no state needed
    };

    return (
        <Container sx={{ mt: 4 }}>
            {cartItems.slice().reverse().map(item => (
                <Box
                    key={item.id}
                    sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                        />
                        <Typography
                            sx={{ cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => navigate(`/product/${item.id}`)}
                        >
                            {item.name} x {item.quantity}
                        </Typography>
                    </Box>

                    <Box>
                        <Button variant="outlined" color="error" onClick={() => removeFromCart(item.id)}>
                            Remove
                        </Button>
                    </Box>
                </Box>
            ))}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">
                    Total: PHP {totalPrice.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCheckout}>
                    Checkout Selected
                </Button>
            </Box>

            <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={clearCart}>
                Clear Cart
            </Button>
        </Container>
    );
}
