// pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Checkbox, Grid, Stack } from "@mui/material";
import { useCart } from "../../../contexts/CartProvider"; // adjust path if needed
import { useCheckout } from "../../../contexts/CheckoutContext";
import { useNavigate } from "react-router-dom";
import BottomActionBar from "../../../components/BottomActionBar";

export default function Cart() {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { setCheckoutItems } = useCheckout();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const cartItemCount = cartItems.length

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
        setCheckoutItems(itemsToCheckout);
        navigate("/checkout", { replace: true });
    };

    return (
        <Container sx={{pb: '180px',}}>
            <Typography variant="h6" color="initial">
                Shopping Cart ({cartItemCount})
            </Typography>
            {cartItems.slice().reverse().map(item => (
                <Grid 
                    key={item.id}
                    container 
                    sx={{width: '100%', boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.3)', my: 3, borderRadius: '5px'}}
                >
                    <Grid size={{xs: 6, sm: 6, md: 4}}>
                        <Box sx={{width: '100%', height: '100%'}}>
                            <Button onClick={() => navigate(`/product/${item.id}`)} sx={{padding: 0}}>
                                <img src={item.image} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1/1', borderRadius: '5px 0px 0px 5px'}}/>
                            </Button>
                        </Box>
                    </Grid>
                    <Grid size={{xs: 6, sm: 6, md: 4,}} sx={{p: 1}}>
                        <Stack sx={{height: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <Box>
                                <Box sx={{display: 'flex', justifyContent: 'end'}}>
                                    <Checkbox onChange={() => toggleSelect(item.id)} checked={selectedIds.includes(item.id)} sx={{p: 0}}/>
                                </Box>
                                <Box sx={{m: 1}}>
                                    <Typography variant="Body1" color="secondary" noWrap sx={{ cursor: "pointer", fontWeight: 'bold' }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ cursor: "pointer" }}>
                                        PHP {item.price}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{my: 1}}>
                                <Button variant="outlined" fullWidth color="error" onClick={() => removeFromCart(item.id)} >
                                    Remove
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            ))}

            {/* Bottom Navigation */}
            <BottomActionBar>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="body1" component='div'>
                        <Stack>
                            <span style={{fontWeight: 'bold'}}>Total:</span>
                            <span style={{color: 'green'}}>PHP {totalPrice.toFixed(2)}</span>
                        </Stack>
                    </Typography>

                    <Button variant="contained" color="error" sx={{ mt: 1, }} onClick={clearCart}>
                        Clear Cart
                    </Button>
                </Box>

                {/* Only show Checkout button if at least one item is selected */}
                {selectedIds.length > 0 && (
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={handleCheckout}
                        sx={{p: 1.5, fontWeight: 'bold'}}    
                    >
                        Checkout Selected
                    </Button>
                )}
            </BottomActionBar>
        </Container>
    );
}
