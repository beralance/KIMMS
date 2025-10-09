import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Dialog, DialogContent, IconButton, Container, Divider, Stack } from "@mui/material";
import { useCart } from "../../../contexts/CartContext";
import { ProductContext } from "../../../contexts/ProductContext"; // import context
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ProductCartRecommendation from "../../../components/ProductCardRecommendation";
import BottomActionBar from '../../../components/BottomActionBar';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { useCheckout } from "../../../contexts/CheckoutContext";
import { ScrollOnTop } from "../../../utils/ScrollOnTop";
import { toTitleCase, formatNumber } from "../../../utils/stringUtils";
import {Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import { SellRounded } from "@mui/icons-material";


export default function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { setCheckoutItems } = useCheckout();
    const { products } = useContext(ProductContext);

    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [imageOpen, setImageOpen] = useState(false);

    ScrollOnTop()
    // Find product and recommendations once products are loaded
    useEffect(() => {
        if (products.length === 0) return;
        const found = products.find((p) => String(p._id) === String(id)); // <--- convert to string
        setProduct(found);

        if (found) { 
            const recs = products.filter(
                (p) => p.category._id === found.category._id && String(p._id) !== String(found._id)
                
            );
            console.log((p) => p.category._id)
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
            <Box sx={{ position: 'fixed', top: 0, m: 2, zIndex: 1000}}>
                <Button variant="contained" color="secondary" onClick={() => navigate(-1) || navigate('/shop')} sx={{ color: 'white', borderRadius: '999px' }}>
                    <ArrowBackIcon sx={{ fontSize: 25 }} />
                </Button>
            </Box>

            {/* Product Image */}
            <Box
                onClick={() => setImageOpen(true)}
                sx={{
                    height: '70vh',
                    bgcolor: 'white',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%'
                }}  
            >
                <Box sx={{width: '100%'}}>
                    <Swiper
                        slidesPerView={1}
                        pagination={{clickable: true}}
                        modules={[ Pagination]}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            "--swiper-pagination-color": "white",
                            "--swiper-pagination-bullet-inactive-color": "#ccc",
                            "--swiper-pagination-bullet-size": "8px",
                        }}
                    >
                        {Array.isArray(product.images) && product.images.length > 0 && (
                            product.images.map((img, idx) => (
                                <SwiperSlide key={idx} style={{height: '70vh'}}>
                                    <Box sx={{justifySelf: 'center', height: '100%', width: '100%'}}>
                                        <img
                                            src={`${img}`}
                                            alt={`${product.productName}`}
                                            style={{ 
                                                display: 'block',
                                                width: "100%",
                                                height: "100%", 
                                                backgroundColor: 'white', 
                                                objectFit: "cover", 
                                            }}
                                        />
                                    </Box>
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </Box>
            </Box>
            <Box
                sx={{
                    height: "100vh",
                    color: "white",
                    position: "relative",
                    bgcolor: 'white',
                    mt: -1,
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '10px 10px 0px 0px',
                    boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.2)'
                }}
            >
                <Container sx={{ flex: { xs: 0, md: 1,}, bgcolor: 'white', borderRadius: '10px 10px 0px 0px', py: 2}}>
                    <section>
                        <Box sx={{mt: 1, mb: 3}}>
                            <Stack direction={'row'} sx={{mb: 2}} >
                                <Box sx={{bgcolor: 'black', opacity: .8, width: 5, mr: 1}}/>
                                <Typography variant="h6" color="secondary" fontWeight={'bold'} maxWidth={'80%'}>{product.productName}</Typography>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'}>
                                <SellRounded color="error" sx={{mr: 1}}/>
                                <Typography variant="body1" color="error" fontWeight={'bold'}>Php {formatNumber(product.price)}</Typography>
                            </Stack>
                        </Box>
                        <Stack direction={'row'} sx={{mb: 5,}} alignItems={'center'}>
                            <Typography variant="subtitle1" color="secondary" sx={{border: 1, px: 2, borderRadius: '999px'}}>
                                {product.category?.name}
                            </Typography>
                            <Divider orientation="vertical" sx={{ height: 20, color: '#37353E', mx: 1}}/>
                            <Typography variant="subtitle1" color="secondary"  sx={{border: 1, px: 2, borderRadius: '999px'}}>
                                {toTitleCase(product.condition)}
                            </Typography>
                        </Stack>
                        <Stack sx={{mb: 3}}>
                            <Typography variant="subtitle1" color="initial">Description: </Typography>
                            <Typography variant="body1" color="secondary" paragraph>{product.description}</Typography>
                        </Stack>
                        <Stack sx={{mb: 3}}>
                            <Typography variant="subtitle1" color="initial">Details:</Typography>
                            <Typography variant="body1" color="secondary" paragraph>
                                {product.details}
                            </Typography>
                        </Stack>
                        
                    </section>
                    {/* Recommendations */}
                    {recommendations.length > 0 && (
                        <>
                            <Divider sx={{ my: 5 }} />
                            <section>
                                <Typography variant="body1" color="secondary" sx={{ my: 2, fontWeight: 'bold' }}>
                                    You may also like
                                </Typography>
                                <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, p: 1.5, borderRadius: 2, scrollBehavior: 'smooth', height: 'auto' }}>
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
            </Box>
            <Box sx={{ flex: 1, textAlign: "center",}}>
                <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="lg">
                    <IconButton
                        onClick={() => setImageOpen(false)}
                        sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={0}
                            pagination={{clickable: true}}
                            modules={[ Pagination]}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                "--swiper-pagination-color": "white",
                                "--swiper-pagination-bullet-inactive-color": "#ccc",
                                "--swiper-pagination-bullet-size": "8px",
                            }}
                        >
                            {Array.isArray(product.images) && product.images.length > 0 && (
                                product.images.map((img, idx) => (
                                    <SwiperSlide key={idx} style={{height: '50vh',}}>
                                        <Box sx={{justifySelf: 'center', height: '100%', width: '100%'}}>
                                            <img
                                                src={`${img}`}
                                                alt={`${product.productName}`}
                                                style={{ 
                                                    display: 'block',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover', 
                                                }}
                                            />
                                        </Box>
                                    </SwiperSlide>
                                ))
                            )}
                        </Swiper>
                    </Box>
                    <Box sx={{position: 'absolute', bottom: 0, backdropFilter: 'blur(10px)', zIndex:  100, WebkitBackdropFilter: "blur(10px)", borderRadius: .5, px: 2, py: .5}}> 
                        <Typography variant="body2" color="white">
                            {product.productName}
                        </Typography>
                    </Box>
                </Dialog>
            </Box>

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
