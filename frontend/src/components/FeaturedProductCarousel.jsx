import React from "react";
import { useNavigate } from 'react-router-dom';
import ProductCardSimple from "./ProductCardSimple";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow, Navigation } from 'swiper/modules';
import products from '../data/products';
import { useCart } from '../contexts/CartProvider';
import { Box } from "@mui/material";

export default function FeaturedProductCarousel() {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product, 1); // Global snackbar will handle success/duplicate notifications
    }

    return (
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
                    fontSize: "1rem", // control arrow size
                },
                "--swiper-navigation-size": "2rem",
                "--swiper-pagination-color": "#222222ff",
                "--swiper-pagination-bullet-size": ".4rem",
            }}

        >
            <Swiper 
                style={{
                    padding: '.4rem',
                }}
                slidesPerView={2}
                navigation
                spaceBetween={10}
                pagination
                modules={[EffectCoverflow, Pagination, Navigation]}
                breakpoints={{
                    0: { slidesPerView: 1, centeredSlides: true },
                    400: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
                    650: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
                    800: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
                    1000: { slidesPerView: 4, spaceBetween: 30, centeredSlides: false },
                }}
            >
                {products.map(product => (
                    <SwiperSlide key={product.id}>
                        <ProductCardSimple 
                            product={product} 
                            onNavigate={() => navigate(`/product/${product.id}`)} 
                            addToCart={() => handleAddToCart(product)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}
