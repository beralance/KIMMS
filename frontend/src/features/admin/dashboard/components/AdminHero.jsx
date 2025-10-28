import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// import swiper styles
import "swiper/css";
import "swiper/css/pagination";
import SectionWrapper from "../../../../components/SectionWrapper";

export default function AdminHero() {
    const images = [
        {id: 0, path: '/minimalist-black-interior-with-black-sofa.jpg',},
        {id: 1, path: '/yellow-armchair-living-room-with-copy-space.jpg',},
        {id: 2, path: '/background01.jpg',},
       
    ];

    return (
        <Box sx={{ width: "100%", mt: 2, borderRadius: 3}}>
            <SectionWrapper sx={{p: 1}}>
                <Typography variant="body1" color="initial" gutterBottom>
                    Welcome
                </Typography>
                <Swiper
                    style={{
                        width: "100%",
                        position: 'relative', // follows parent container width
                        "--swiper-pagination-color": "white",
                        "--swiper-pagination-bullet-size": ".5rem",
                    }}
                    spaceBetween={0}
                    centeredSlides
                    loop={true}
                    autoplay={{
                        delay: 3000,
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
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <Box sx={{position: "absolute", backgroundImage: `url(${src.path})`, backgroundSize: '100%', backgroundOrigin: 'center', backgroundPosition: 'center'}}/>
                                <img
                                    src={src.path}
                                    alt={`Slide ${index + 1}`}
                                    style={{ width: "100%", borderRadius: '5px', height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </SectionWrapper>
        </Box>
    );
}
