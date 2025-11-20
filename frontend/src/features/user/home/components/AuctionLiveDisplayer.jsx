import React, { useEffect, useState } from "react";
import { HourglassIcon } from "lucide-react";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow, Navigation } from "swiper/modules";
import SectionWrapper from "../../../../components/SectionWrapper";
import SectionTransition from "../../../../components/SectionTransition";
import { formatNumber } from "../../../../utils/stringUtils";
import dayjs from "dayjs";

const AuctionLiveDisplayer = ({ auctions }) => {
    const navigate = useNavigate();
    const [timeLefts, setTimeLefts] = useState("");

    useEffect(() => {
        if (!auctions || auctions.length === 0) return;

        const updatetimeLefts = () => {
            const now = new Date();
            const newTimeLefts = {};

            auctions.forEach((auction) => {
                const deadline = new Date(auction.endTime);
                const diff = deadline - now;

                if (diff <= 0) {
                    newTimeLefts[auction._id] = "Expired";
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff / (1000 * 60)) % 60);
                    const seconds = Math.floor((diff / 1000) % 60);
                    newTimeLefts[
                        auction._id
                    ] = `${hours}h ${minutes}m ${seconds}s`;
                }
            });

            setTimeLefts(newTimeLefts);
        };

        updatetimeLefts();
        const interval = setInterval(updatetimeLefts, 1000);

        return () => clearInterval(interval);
    }, [auctions]);

    return (
        <>
            <Box>
                <Box
                    sx={{
                        "& .swiper-button-next, & .swiper-button-prev": {
                            color: "white",
                            fontWeight: "bold",
                            backgroundColor: "#383838ff",
                            borderRadius: "50%",
                            display: "flex",
                            height: "2rem",
                            width: "2rem",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                        "& .swiper-button-next::after, & .swiper-button-prev::after":
                            {
                                fontSize: "1rem",
                            },
                        "--swiper-navigation-size": "2rem",
                        "--swiper-pagination-color": "#222222ff",
                        "--swiper-pagination-bullet-size": ".4rem",
                    }}
                >
                    <Swiper
                        style={{ maxHeight: "100%" }}
                        navigation
                        modules={[EffectCoverflow, Navigation]}
                        breakpoints={{
                            0: { slidesPerView: 1, centeredSlides: true },
                            600: { slidesPerView: 2, centeredSlides: true },
                            800: { slidesPerView: 3, centeredSlides: false },
                            1000: { slidesPerView: 4, centeredSlides: false },
                        }}
                    >
                        {auctions.map((live) => (
                            <SwiperSlide key={live._id}>
                                <SectionWrapper
                                    sx={{ bgcolor: "#f0f0f0", p: 1 }}
                                >
                                    <SectionTransition>
                                        <Stack gap={2}>
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/auction/listing/product-preview/${live._id}`
                                                    )
                                                }
                                            >
                                                <img
                                                    src={
                                                        live.inventoryId
                                                            .images[0]
                                                    }
                                                    style={{
                                                        display: "block",
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                        aspectRatio: "9/12",
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: 10,
                                                        right: 10,
                                                        borderRadius: "999px",
                                                        px: 2,
                                                        bgcolor: "error.main",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="white"
                                                        fontWeight={"bold"}
                                                    >
                                                        {live?.status}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Stack gap={2}>
                                                <Stack px={1}>
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight={"bold"}
                                                        color="secondary"
                                                        align="center"
                                                    >
                                                        {
                                                            live?.inventoryId
                                                                ?.productName
                                                        }
                                                    </Typography>
                                                    <Stack
                                                        direction={"row"}
                                                        gap={2}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="gray"
                                                            align="center"
                                                        >
                                                            {
                                                                live
                                                                    ?.inventoryId
                                                                    ?.description
                                                            }
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack
                                                    direction={"row"}
                                                    justifyContent={
                                                        "space-between"
                                                    }
                                                    p={1}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        align="center"
                                                        color="gray"
                                                    >
                                                        Time left:
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        align="center"
                                                        color="success"
                                                        fontWeight={"bold"}
                                                    >
                                                        {timeLefts[live._id]}{" "}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </SectionTransition>
                                </SectionWrapper>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Box>
        </>
    );
};

export default AuctionLiveDisplayer;
