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
import { OrderContext } from "../../../contexts/OrderContext";


export default function SoldProductDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const {orders} = useContext(OrderContext)
    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [imageOpen, setImageOpen] = useState(false);
    const { products } = useContext(ProductContext);

    const category = product?.productId?.category

    useEffect(() => {
        const purchasedProductData = orders
            .flatMap(order => order.products)
            .filter(p => p.productId?._id === id);
        setProduct(purchasedProductData[0])
    }, [])

    useEffect(() => {
        console.log('test', product)

        if (category) { 
            const recs = products.filter(
                (p) => p.category?._id === category?._id && String(p._id) !== String(_id)
            );
            console.log('')
            setRecommendations(recs);
        }
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 0, md: 4 }}}>
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
                        {Array.isArray(product?.productId?.images) && product?.productId?.images.length > 0 && (
                            product?.productId?.images.map((img, idx) => (
                                <SwiperSlide key={idx} style={{height: '70vh'}}>
                                    <Box sx={{justifySelf: 'center', height: '100%', width: '100%'}}>
                                        <img
                                            src={`${img}`}
                                            alt={`${product?.productId?.productName}`}
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
                    <Stack      
                        sx={{
                            position: 'absolute', 
                            top: 10, right: 0,
                            borderRadius: 2,
                            px: 3,
                            zIndex: 5,
                        }}
                    >
                        <img src="/sold.svg" alt="" style={{display: 'block', width: '100px', height: '100px', }}/>
                    </Stack>
                </Box>
            </Box>
            <Box
                sx={{
                    height: "100%",
                    minHeight: '100vh',
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
                        <Stack gap={2}>
                            <Stack sx={{gap: 4}}>
                                <Stack gap={1}>
                                    <Stack direction={'row'}>
                                        <Box sx={{bgcolor: 'black', opacity: .8, borderRadius: 1, width: 5, mr: 2}}/>
                                        <Typography variant="h6" color="gray" fontWeight={'bold'} maxWidth={'80%'} sx={{textDecoration: 'line-through'}}>{product?.productId?.productName}</Typography>
                                    </Stack>
                                    <Stack direction={'row'} alignItems={'center'}>
                                        <SellRounded color="error" sx={{mr: 1}}/>
                                        <Typography variant="body1" color="gray" sx={{textDecoration: 'line-through'}}>Php {formatNumber(product?.productId?.price)}</Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'} alignItems={'center'}>
                                    <Typography variant="subtitle1" color="secondary" sx={{border: 1, px: 2, borderRadius: '999px'}}>
                                        {product?.productId?.category?.name}
                                    </Typography>
                                    <Divider orientation="vertical" sx={{ height: 20, color: '#37353E', mx: 1}}/>
                                    <Typography variant="subtitle1" color="secondary"  sx={{border: 1, px: 2, borderRadius: '999px'}}>
                                        {toTitleCase(product?.productId?.condition)}
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Typography variant="subtitle1" color="initial">Description: </Typography>
                                    <Typography variant="body1" color="secondary" paragraph>{product?.productId?.description}</Typography>
                                </Stack>
                                <Stack>
                                    <Typography variant="subtitle1" color="initial">Details:</Typography>
                                    <Typography variant="body1" color="secondary" paragraph>
                                        {product?.productId?.details}
                                    </Typography>
                                </Stack>
                            </Stack>
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
            <Box sx={{ flex: 1, textAlign: "center"}}>
                <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="lg" PaperProps={{sx: {bgcolor: 'transparent', boxShadow: 0}}}>
                    <Box>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={50}
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
                            {Array.isArray(product?.productId?.images) && product?.productId?.images.length > 0 && (
                                product?.productId?.images.map((img, idx) => (
                                    <SwiperSlide key={idx} style={{alignSelf: 'center', position: 'relative'}}>
                                        <Box sx={{height: '100%', width: '100%'}}>
                                            <img
                                                src={`${img}`}
                                                alt={`${product?.productId?.productName}`}
                                                style={{ 
                                                    display: 'block',
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                }}
                                            />
                                        </Box>
                                        <IconButton
                                            onClick={() => setImageOpen(false)}
                                            sx={{ position: "absolute", p: .5, bgcolor: 'rgba(255, 255, 255, 0.8)', top: 8, right: 8, zIndex: 10 }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <Box sx={{position: 'absolute', bottom: 10, backdropFilter: 'blur(10px)', zIndex:  100, WebkitBackdropFilter: "blur(10px)", borderRadius: .5, px: 2, py: .5}}> 
                                            <Typography variant="body1" color="initial">
                                                {product.productId?.productName}
                                            </Typography>
                                        </Box>
                                    </SwiperSlide>
                                ))
                            )}
                        </Swiper>
                    </Box>
                </Dialog>
            </Box>
        </Box>
    );
}
