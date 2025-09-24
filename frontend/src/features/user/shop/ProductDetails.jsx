import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Dialog, DialogContent, IconButton, Container, Divider } from "@mui/material";
import { useCart } from "../../../contexts/CartContext";
import { ProductContext } from "../../../contexts/ProductContext"; // import context
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ProductCartRecommendation from "../../../components/ProductCardRecommendation";
import BottomActionBar from '../../../components/BottomActionBar';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { useCheckout } from "../../../contexts/CheckoutContext";
import { UPLOADS_URL } from "../../../utils/constants";


export default function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { setCheckoutItems } = useCheckout();
    const { products } = useContext(ProductContext);

    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [imageOpen, setImageOpen] = useState(false);

    // Find product and recommendations once products are loaded
    useEffect(() => {
        if (products.length === 0) return;

        const found = products.find((p) => String(p._id) === String(id)); // <--- convert to string
        setProduct(found);

        if (found) {
            const recs = products.filter(
                (p) => p.category === found.category && String(p._id) !== String(found._id)
            );
            setRecommendations(recs);
        }
    }, [products, id]);


    if (!product) {
        return <Typography variant="h5" sx={{ m: 2 }}>Product not found</Typography>;
    }

    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleCheckout = () => {
        setCheckoutItems([{ ...product}]);
        navigate('/checkout', { replace: true });
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 0, md: 4 }, pb: 10, }}>
            {/* Back button */}
            <Box sx={{ position: 'fixed', top: 0, m: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ color: 'white', borderRadius: '999px' }}>
                    <ArrowBackIcon sx={{ fontSize: 25 }} />
                </Button>
            </Box>

            {/* Product Image */}
            <Box sx={{ flex: 1, textAlign: "center",}}>
                <Box sx={{maxHeight: 400}}>
                    <img
                        src={`${UPLOADS_URL}${product.image}`}
                        alt={product.name}
                        style={{height: '100%', width: '100%', aspectRatio: '1/1', cursor: "pointer", objectFit: "cover" }}
                        onClick={() => setImageOpen(true)}
                    />
                </Box>
                <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="lg">
                    <IconButton
                        onClick={() => setImageOpen(false)}
                        sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{display: 'flex'}}>
                        <img
                            src={`${UPLOADS_URL}${product.image}`}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </Box>
                    <Box sx={{position: 'absolute', bottom: 0, backdropFilter: 'blur(10px)', WebkitBackdropFilter: "blur(10px)", borderRadius: .5, px: 2, py: .5}}> 
                        <Typography variant="body2" color="white">
                            {product.productName}
                        </Typography>
                    </Box>
                </Dialog>
            </Box>

            <Container sx={{ flex: { xs: 0, md: 1,}, bgcolor: 'white', borderRadius: '10px 10px 0px 0px', py: 2}}>
                <section>
                    <Box sx={{ mb: 3 , borderRadius: '10px 10px 0px 0px'}}>
                        <Typography variant="h5" gutterBottom>{product.productName}</Typography>
                        <Typography variant="subtitle1" color="secondary" gutterBottom>${product.price}</Typography>
                    </Box>
                    <Typography variant="subtitle1" color="secondary" paragraph>{product.description}</Typography>
                    {product.category && (
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Category: {product.category}
                        </Typography>
                    )}
                </section>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <>
                        <Divider sx={{ my: 5 }} />
                        <section>
                            <Typography variant="body1" color="secondary" sx={{ my: 2, fontWeight: 'bold' }}>
                                You may also like
                            </Typography>
                            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, bgcolor: '#f0f0f0', p: 1.5, borderRadius: 2, scrollBehavior: 'smooth', height: 'auto' }}>
                                {recommendations.map((rec) => (
                                    <Box key={rec._id}>
                                        <ProductCartRecommendation
                                            product={rec}
                                            onNavigate={() => {
                                                navigate(`/product/${rec._id}`);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </section>
                    </>
                )}
            </Container>

            <BottomActionBar>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="text" color="secondary" onClick={handleAddToCart} sx={{ flexGrow: 1 }}>
                        <ShoppingCartRoundedIcon />
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCheckout} sx={{ width: '100%', flexGrow: 2 }}>
                        Checkout
                    </Button>
                </Box>
            </BottomActionBar>
        </Box>
    );
}
