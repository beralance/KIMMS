import React from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// import swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function AdminAutoSlideCarousel() {
  const images = [
    "https://media.istockphoto.com/id/2152274330/photo/modern-living-room-interior-with-sofa-armchairs-coffee-table-pendant-light-and-potted-plant.jpg?s=612x612&w=0&k=20&c=wH9IpBEbxXuS5vDhAsuGRZJMygwDyPzvxKMA_Tq_jdo=",
    "https://media.istockphoto.com/id/1298922821/photo/living-room-design-with-empty-frame-mockup-two-wooden-chairs-on-white-wall.jpg?s=612x612&w=0&k=20&c=6pGrMOA4NO2n8w6nRbp9NT2J-g-gm8k95Jzv9LoAGOw=",
    "https://media.istockphoto.com/id/2154807078/photo/modern-interior-of-living-room-with-sofa-on-wood-flooring-and-dark-blue-wall-3d-rendering.jpg?s=612x612&w=0&k=20&c=1qSH9dX-Hms84CgzQBLjSOu23vfL3JWXMW53pExXj6I=",
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Swiper
        style={{
          width: "100%", // follows parent container width
          "--swiper-pagination-color": "#222",
          "--swiper-pagination-bullet-size": ".5rem",
        }}
        spaceBetween={0}
        centeredSlides
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16/9", // keeps responsive ratio
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
