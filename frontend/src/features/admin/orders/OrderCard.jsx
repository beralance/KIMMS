import React, { useEffect, useState } from "react";
import { FlightTakeoffSharp } from "@mui/icons-material";
import {
    Box,
    Collapse,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    Grid,
} from "@mui/material";
import dayjs from "dayjs";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import {
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon,
    ArrowRightIcon,
    BanknoteIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CopyCheckIcon,
    CopyIcon,
    GavelIcon,
    HandCoinsIcon,
    PackageIcon,
    PackageOpenIcon,
    ShoppingBasketIcon,
    WalletIcon,
} from "lucide-react";
import SectionWrapper from "../../../components/SectionWrapper";
import { formatNumber, toTitleCase } from "../../../utils/stringUtils";

const OrderCard = ({ orderData, op, openDrawer = false }) => {
    const [openDetails, setOpenDetails] = useState(false);
    const [openProductPreview, setOpenProductPreview] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDetailsOpen = () => setOpenDetails(true);
    const handleDetailsClose = () => setOpenDetails(false);

    useEffect(() => {
        if (openDrawer) {
            console.log(" IF IS SHOW INSIDE USE EFFECT");
            handleDetailsOpen();
        } else {
            console.log(" IF else IS SHOW INSIDE USE EFFECT");
            handleDetailsClose();
        }
    }, [openDrawer]);

    return (
        <>
            <Box>
                <SectionWrapper sx={{ boxShadow: 2 }}>
                    <Stack sx={{ borderRadius: 2 }} gap={2}>
                        <Stack
                            direction={"row"}
                            gap={2}
                            alignItems={"center"}
                            sx={{ position: "relative" }}
                        >
                            <Stack
                                alignItems={"center"}
                                sx={{ position: "relative" }}
                            >
                                <img
                                    src={orderData.userId?.avatar}
                                    style={{
                                        boxShadow:
                                            "0px 0px 5px rgba(0, 0, 0, 0.5)",
                                        width: "50px",
                                        height: "50px",
                                        display: "block",
                                        objectFit: "cover",
                                        borderRadius: "999px",
                                    }}
                                />
                            </Stack>
                            <Stack sx={{ width: "100%", overflow: "hidden" }}>
                                <Typography
                                    variant="body1"
                                    color="secondary"
                                    fontWeight={"bold"}
                                    sx={{
                                        maxWidth: "70%",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {orderData?.userId?.fullName}
                                </Typography>
                                <Stack
                                    direction={"row"}
                                    gap={1}
                                    alignItems={"center"}
                                >
                                    <Typography variant="body2" color="initial">
                                        {orderData.orderId || ""}
                                    </Typography>
                                    <Tooltip title="Copy Order ID">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    orderData.orderId || ""
                                                );
                                                setCopied(true);
                                                setTimeout(() => {
                                                    setCopied(false);
                                                }, 2000);
                                            }}
                                        >
                                            {copied ? (
                                                <CopyCheckIcon
                                                    style={{ color: "green" }}
                                                />
                                            ) : (
                                                <CopyIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>
                            <Box
                                sx={{ position: "absolute", top: -5, right: 2 }}
                            >
                                <IconButton
                                    sx={{
                                        bgcolor: "secondary.main",
                                        boxShadow: 2,
                                    }}
                                    onClick={handleDetailsOpen}
                                >
                                    <ArrowRightIcon
                                        style={{ color: "white" }}
                                    />
                                </IconButton>
                            </Box>
                        </Stack>
                        <Stack
                            gap={2}
                            sx={{
                                bgcolor: "#f7f7f7ff",
                                borderRadius: 2,
                                py: 2,
                                p: 2,
                                my: 1,
                            }}
                        >
                            <Stack>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <Stack gap={1}>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <WalletIcon />
                                                Payment:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="white"
                                                sx={{
                                                    py: 0.3,
                                                    bgcolor:
                                                        "rgba(0, 0, 0, 0.5)",
                                                    borderRadius: "999px",
                                                }}
                                                align="center"
                                            >
                                                -{" "}
                                                {toTitleCase(
                                                    orderData.paymentStatus
                                                )}{" "}
                                                -
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Stack gap={1}>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                {orderData?.orderType ===
                                                "auction" ? (
                                                    <GavelIcon />
                                                ) : (
                                                    <ShoppingBasketIcon />
                                                )}
                                                Type:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="white"
                                                sx={{
                                                    py: 0.3,
                                                    bgcolor:
                                                        "rgba(0, 0, 0, 0.5)",
                                                    borderRadius: "999px",
                                                }}
                                                align="center"
                                            >
                                                -{" "}
                                                {toTitleCase(
                                                    orderData.orderType
                                                )}{" "}
                                                order -
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Stack gap={1}>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <HandCoinsIcon />
                                                Payment method:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="white"
                                                sx={{
                                                    py: 0.3,
                                                    bgcolor:
                                                        "rgba(0, 0, 0, 0.5)",
                                                    borderRadius: "999px",
                                                }}
                                                align="center"
                                            >
                                                -{" "}
                                                {orderData.paymentMethod ===
                                                "gcash"
                                                    ? "GCash"
                                                    : "Cash on Delivery"}{" "}
                                                -
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Stack gap={1}>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <BanknoteIcon />
                                                Total Amount:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="white"
                                                sx={{
                                                    py: 0.3,
                                                    bgcolor:
                                                        "rgba(0, 0, 0, 0.5)",
                                                    borderRadius: "999px",
                                                }}
                                                align="center"
                                            >
                                                - Php{" "}
                                                {formatNumber(
                                                    orderData.finalPrice
                                                )}{" "}
                                                -{" "}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                            <Divider />
                            <Stack gap={1}>
                                <Stack
                                    direction={"row"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                >
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        fontWeight={
                                            openProductPreview
                                                ? "bold"
                                                : "initial"
                                        }
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        {openProductPreview ? (
                                            <PackageOpenIcon />
                                        ) : (
                                            <PackageIcon />
                                        )}
                                        View Products
                                    </Typography>
                                    <IconButton
                                        onClick={() =>
                                            setOpenProductPreview(
                                                (prev) => !prev
                                            )
                                        }
                                    >
                                        {openProductPreview ? (
                                            <ChevronUpIcon />
                                        ) : (
                                            <ChevronDownIcon />
                                        )}
                                    </IconButton>
                                </Stack>
                                <Collapse
                                    in={openProductPreview}
                                    mountOnEnter
                                    unmountOnExit
                                >
                                    <Stack
                                        gap={2}
                                        direction={"row"}
                                        sx={{ p: 1, borderRadius: 1 }}
                                    >
                                        {(Array.isArray(orderData.products)
                                            ? orderData.products
                                            : [orderData.products]
                                        ).map((product) => (
                                            <Box
                                                key={product?._id}
                                                sx={{
                                                    height: 70,
                                                    width: 70,
                                                    overflowX: "auto",
                                                    maxWidth: "100%",
                                                    boxShadow: 2,
                                                }}
                                            >
                                                <img
                                                    src={
                                                        product?.productId
                                                            ?.images[0]
                                                    }
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: "3px",
                                                        aspectRatio: "1/1",
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Collapse>
                            </Stack>
                        </Stack>
                        <Stack>
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                            >
                                <Typography variant="body2" color="secondary">
                                    {dayjs(orderData?.createdAt).format(
                                        "MMMM D, YYYY"
                                    )}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    {dayjs(orderData?.createdAt).format(
                                        "h:mm A"
                                    )}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </SectionWrapper>
            </Box>
            <OrderDetailsDrawer
                open={openDetails}
                onClose={handleDetailsClose}
                orderData={orderData}
            />
        </>
    );
};

export default OrderCard;
