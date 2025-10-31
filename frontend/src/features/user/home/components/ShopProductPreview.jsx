import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import {} from 'lucide-react'
import {ProductContext} from '../../../../contexts/ProductContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

const ShopProductPreview = () => {
    const {products} = useContext(ProductContext)

    return (
        <Box>
            <Swiper
                style={{
                    width: "100%",
                    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.5)',
                    borderRadius: '5px',
                    overflow: 'hidden',

                }}
                spaceBetween={0}
                centeredSlides
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay]}
                loop
            >
                {[...products]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 10)
                    .map((product) => (  
                    <SwiperSlide key={product._id} style={{position: 'relative'}}>
                        <img 
                            src={product.images?.[0]}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                aspectRatio: '9/11',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}

export default ShopProductPreview
