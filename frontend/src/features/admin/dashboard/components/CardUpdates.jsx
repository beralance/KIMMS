import React from "react";
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { formatNumber } from "../../../../utils/stringUtils";
import dayjs from "dayjs";
const CardUpdates = ({ data }) => {
    return (
        <>
            <Stack
                gap={2}
                direction={"row"}
                sx={{
                    overflowX: "auto",
                    p: 2,
                    width: "100%",
                    borderRadius: 1,
                    bgcolor: "#f0f0f0",
                }}
            >
                {data?.map((product) => (
                    <Stack
                        key={product._id}
                        gap={1}
                        sx={{
                            boxShadow: 3,
                            p: 1,
                            bgcolor: "white",
                            borderRadius: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 250,
                                height: 300,
                                position: "relative",
                            }}
                        >
                            <img
                                src={product.images?.[0]}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    borderRadius: "2px",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 5,
                                    left: 5,
                                    bgcolor: "rgba(0, 0, 0, 0.5)",
                                    px: 1,
                                    borderRadius: 1,
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <Typography variant="body2" color="white">
                                    {dayjs(product.createdAt).format(
                                        "MMMM DD YYYY"
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                        <Stack>
                            <Typography variant="body1" color="initial">
                                {product.productName}
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Php {formatNumber(product.price)}
                            </Typography>
                            <Stack direction={"row"} sx={{ py: 2 }}>
                                <Typography
                                    variant="body2"
                                    color="gray"
                                    sx={{
                                        border: "1px solid gray",
                                        px: 1,
                                        borderRadius: "999px",
                                    }}
                                >
                                    {product.category?.name}
                                </Typography>
                                <Divider
                                    orientation="vertical"
                                    sx={{ mx: 1 }}
                                />
                                <Typography
                                    variant="body2"
                                    color="gray"
                                    sx={{
                                        border: "1px solid gray",
                                        px: 1,
                                        borderRadius: "999px",
                                    }}
                                >
                                    {product.condition}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </>
    );
};

export default CardUpdates;
