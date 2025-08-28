import React, { useRef } from "react";
import { Box } from "@mui/material";
import {Swiper, SwiperSlide} from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

export default function AutoSlideCarousel() {

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3wxJ0c-jC6VcDASO9aiDWD9zWAeJLKrS5gg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3wxJ0c-jC6VcDASO9aiDWD9zWAeJLKrS5gg&s",
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7s8jgunlzu9RHZlpQDsmht3vHqCYFmWk4eg&s',
  ]

  return (
    <Box sx={{mb: {xs: 5, md: 10}}}>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Box sx={{width: '100%', aspectRatio: '16/9', overflow: 'hidden', maxHeight: {xs: 300, md: 300}}}>
              <img style={{width: '100%', height: '100%', objectFit: 'cover'}} src={src} alt={`Slide ${index + 1}`}/>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
