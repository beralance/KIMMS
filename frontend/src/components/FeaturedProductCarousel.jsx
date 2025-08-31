import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import ProductCardSimple from "./ProductCardSimple";
import { Box } from "@mui/material";
import {Swiper, SwiperSlide} from 'swiper/react'
import { Pagination, EffectCoverflow, Navigation } from 'swiper/modules'
import products from '../data/products'
import { useCart } from '../contexts/CartProvider';
import CustomSnackbar from './CustomSnackbar'

export default function FeaturedProductCarousel() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        setSnackBarMessage(`${product.name} added to Cart!`);
        setSnackBarOpen(true);
    }

    return (
        <>
            <Swiper 
                style={{
                    padding: '.4rem',
                    '--swiper-navigation-color': '#1976d2', 
                    '--swiper-navigation-size': '2rem', 
                    '--swiper-pagination-color': '#222222ff',
                    '--swiper-pagination-bullet-size': '.4rem',
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

            {/* Global Snackbar */}
            <CustomSnackbar 
                open={snackBarOpen} 
                onClose={() => setSnackBarOpen(false)}
                message={snackBarMessage}
            />
        </>
    );
}
