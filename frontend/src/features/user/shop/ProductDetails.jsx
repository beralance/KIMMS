import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Dialog, DialogContent, IconButton, Container, Snackbar, Alert } from "@mui/material";
import { useCart } from "../../../contexts/CartProvider";
import products from '../../../data/products';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const product = products.find((p) => p.id === parseInt(id));
    const [quantity, setQuantity] = useState(1);
    const [imageOpen, setImageOpen] = useState(false);

    // Snackbar state
    const [snackOpen, setSnackOpen] = useState(false);

    if (!product) {
        return <Typography variant="h5">Product not found</Typography>;
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setSnackOpen(true); // show snackbar
    };

    const handleSnackClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: {xs: 0, md: 4}}}>
            {/* Back button */}
            <Box sx={{position: 'fixed', top: 0, m: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{color: 'white', borderRadius: '999px', }}>
                    <ArrowBackIcon sx={{fontSize: 25}}/>
                </Button>
            </Box>

            {/* Product Image */}
            <Box sx={{ flex: 1, textAlign: "center", mb: 2}}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ maxWidth: "100%", aspectRatio: '1/1', cursor: "pointer", objectFit: "cover" }}
                    onClick={() => setImageOpen(true)}
                />

                <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="lg">
                    <IconButton
                        onClick={() => setImageOpen(false)}
                        sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ p: 0 }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "100%", height: "auto", objectFit: "contain" }}
                        />
                    </DialogContent>
                </Dialog>
            </Box>

            {/* Product Details */}
            <Container sx={{ flex: {xs: 0, md: 1} }}>
                <Typography variant="h5" gutterBottom>{product.name}</Typography>
                <Typography variant="h6" color="primary" gutterBottom>${product.price}</Typography>
                <Box sx={{mx: 1, my: 2}}>
                    <hr/>
                </Box>
                <Typography variant="body1" paragraph>{product.description}</Typography>
                {product.category && (
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Category: {product.category}
                    </Typography>
                )}

                {/* Quantity and Add to Cart */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
                    <TextField
                        type="number"
                        label="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                        inputProps={{ min: 1 }}
                        sx={{ width: 100 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                    Added {quantity} x {product.name} to cart!
                </Alert>
            </Snackbar>
        </Box>
    );
}
