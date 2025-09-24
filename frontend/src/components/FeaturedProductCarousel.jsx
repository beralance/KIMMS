import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCardSimple from "./ProductCardSimple";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow, Navigation } from 'swiper/modules';
import { ProductContext } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { Box, Typography } from "@mui/material";

export default function FeaturedProductCarousel() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { products } = useContext(ProductContext); // get products from context

    const handleAddToCart = (product) => {
        addToCart(product); 
    }

    // Filter only featured products
    const featuredProducts = products.filter(p => p.highlight === "featured");

    return featuredProducts.length > 0 ? (
        <Box
            sx={{
                "& .swiper-button-next, & .swiper-button-prev": {
                    color: "white",
                    fontWeight: 'bold',
                    backgroundColor: "#383838ff",
                    borderRadius: "50%",
                    width: "2rem",
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
                "& .swiper-button-next::after, & .swiper-button-prev::after": {
                    fontSize: "1rem",
                },
                "--swiper-navigation-size": "2rem",
                "--swiper-pagination-color": "#222222ff",
                "--swiper-pagination-bullet-size": ".4rem",
            }}
        >
            <Typography variant="h6" component='h2' color="secondary" sx={{mb: 2, textAlign: 'center'}}>
                Handpicked just for you!
            </Typography>
            
            <Swiper 
                style={{ padding: '.4rem' }}
                slidesPerView={2}
                navigation
                spaceBetween={10}
                pagination
                modules={[EffectCoverflow, Pagination, Navigation]}
                breakpoints={{
                    0: { slidesPerView: 1, centeredSlides: true },
                    500: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
                    650: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
                    800: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
                    1000: { slidesPerView: 4, spaceBetween: 30, centeredSlides: false },
                }}
            >
                
                {featuredProducts.map(product => (
                    <SwiperSlide key={product._id}>
                        <ProductCardSimple 
                            product={product} 
                            onNavigate={() => navigate(`/product/${product._id}`)} 
                            addToCart={() => handleAddToCart(product)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    ) : null;
}
