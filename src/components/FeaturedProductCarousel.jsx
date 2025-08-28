import React, { useRef } from "react";
import ProductCardSimple from "./ProductCardSimple";
import { Box } from "@mui/material";
import {Swiper, SwiperSlide} from 'swiper/react'
import { Pagination, EffectCoverflow, Navigation } from 'swiper/modules'

export default function FeaturedProductCarousel() {

    const products = [
        {name: 'Cabinet', price: 100, description: 'sample desc', image: 'https://img.lazcdn.com/g/p/ddb14cd68fa796dab4ccaf7d39325f77.png_720x720q80.png'},
        {name: 'Cabinet', price: 100, description: 'sample desc', image: 'https://img.lazcdn.com/g/p/ddb14cd68fa796dab4ccaf7d39325f77.png_720x720q80.png'},
        {name: 'Cabinet', price: 100, description: 'sample desc', image: 'https://img.lazcdn.com/g/p/ddb14cd68fa796dab4ccaf7d39325f77.png_720x720q80.png'},
        {name: 'Cabinet', price: 100, description: 'sample desc', image: 'https://img.lazcdn.com/g/p/ddb14cd68fa796dab4ccaf7d39325f77.png_720x720q80.png'},
        {name: 'Cabinet', price: 100, description: 'sample desc', image: 'https://img.lazcdn.com/g/p/ddb14cd68fa796dab4ccaf7d39325f77.png_720x720q80.png'}
    ]

    return (
        <>
            <Swiper style={{
                padding: '.4rem',
                '--swiper-navigation-color': '#1976d2', 
                '--swiper-navigation-size': '2rem', 
                '--swiper-pagination-color': '#222222ff',
                '--swiper-pagination-bullet-size': '.4rem',
            }}
                slidesPerView={2}
                navigation={true}
                spaceBetween={10}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Navigation]}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        centeredSlides: true
                    },
                    400: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        centeredSlides: false
                    },
                    650: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        centeredSlides: false,
                    },
                    800: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        centeredSlides: false,
                    },
                    1000: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                        centeredSlides: false,
                    },
                }}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <Box>
                            <ProductCardSimple name={product.name} description={product.description} price={product.price} image={product.image}/>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}