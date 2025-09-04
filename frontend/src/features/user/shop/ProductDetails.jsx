import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Dialog, DialogContent, IconButton, Container, Slide, Divider } from "@mui/material";
import { useCart } from "../../../contexts/CartProvider";
import products from '../../../data/products';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ProductCartRecommendation from "../../../components/ProductCardRecommendation";
import BottomActionBar from '../../../components/BottomActionBar'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { useCheckout } from "../../../contexts/CheckoutContext";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { setCheckoutItems } = useCheckout();

    const handleCheckout = () => {
        setCheckoutItems([{...product, quantity}])
        navigate('/checkout', {replace: 'true'})
    }
    const product = products.find((p) => p.id === parseInt(id));
    const [quantity, setQuantity] = useState(1);
    const [imageOpen, setImageOpen] = useState(false);

    const recommendations = products.filter(
        (p) => p.category === product.category && p.id !== product.id
    )
    if (!product) {
        return <Typography variant="h5">Product not found</Typography>;
    }

    const handleAddToCart = () => {
        addToCart(product, quantity); // global snackbar handles notifications
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: {xs: 0, md: 4}, pb: 10}}>
            {/* Back button */}
            <Box sx={{position: 'fixed', top: 0, m: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => navigate('/shop')} sx={{color: 'white', borderRadius: '999px'}}>
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

            <Container sx={{ flex: {xs: 0, md: 1} }}>
                <section>
                    {/* Product Details */}
                    <Box sx={{mb: 3}}>
                        <Typography variant="h5" gutterBottom>{product.name}</Typography>
                        <Typography variant="h6" color="secondary" gutterBottom>${product.price}</Typography>
                    </Box>
                    <Typography variant="body1" paragraph>{product.description}</Typography>
                    {product.category && (
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Category: {product.category}
                        </Typography>
                    )}

                    
                </section>

                {/* Recommendations */}
                <Divider sx={{my: 5}}/>
                {recommendations.length > 0 && (
                    <section>
                        <Typography variant="body1" color="secondary" sx={{my: 2, fontWeight: 'bold'}}>
                            You may also like
                        </Typography>
                        <Box sx={{display: 'flex', overflowX: 'auto', gap: 2, bgcolor: '#f0f0f0', p: 1.5, borderRadius: 2, scrollBehavior: 'smooth', height: 'auto'}}>
                            
                            {recommendations.map((rec) => (
                                <Box key={rec.id}>
                                    <ProductCartRecommendation 
                                        product={rec} 
                                        onNavigate={() => {
                                            navigate(`/product/${rec.id}`);
                                            window.scrollTo({top: 0, behavior: 'smooth'})
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </section>
                )}
                
            </Container>
            <BottomActionBar>
                {/* Add to Cart */}
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="text" color="secondary" onClick={handleAddToCart} sx={{flexGrow: 1}}>
                        <ShoppingCartRoundedIcon/>        
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCheckout} sx={{width: '100%', flexGrow: 2}}>
                        Checkout
                    </Button>
                </Box>
            </BottomActionBar>
        </Box>
    );
}
