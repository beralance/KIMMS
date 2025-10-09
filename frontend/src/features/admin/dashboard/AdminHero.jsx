import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// import swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function AdminHero() {
    const images = [
        {id: 0, path: '/minimalist-black-interior-with-black-sofa.jpg', headline: "Welcome Back to Kimm's Management Portal", subtext: 'Your workspace for effortless inventory, auctions, and sales - all in one place.', },
        {id: 1, path: '/yellow-armchair-living-room-with-copy-space.jpg', headline: "Manage with Clarity and Confidence",},
        {id: 2, path: '/background01.jpg', headline: `"Every product, every order, every update — organized seamlessly for your team."`,},
       
    ];

    return (
        <Box sx={{ width: "100%" }}>
            <Swiper
                style={{
                    width: "100%",
                    position: 'relative', // follows parent container width
                    "--swiper-pagination-color": "#222",
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
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                        <Stack sx={{position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, bottom: 0, left: 0, right: 0,}}>
                            <Typography variant='h5' color="white" align="center" maxWidth={'80%'} sx={{cursor: 'default'}}>
                                {src.headline}
                            </Typography>
                            <Typography variant='body2' color="white" align="center" maxWidth={'80%'} sx={{cursor: 'default'}}>
                                {src.subtext}
                            </Typography>
                        </Stack>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}
