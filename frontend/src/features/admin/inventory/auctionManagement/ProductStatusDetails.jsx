import {
    Box,
    Stack,
    Collapse,
    Typography,
    Button,
    IconButton,
    Divider,
    SwipeableDrawer,
} from "@mui/material";
import {
    KeyboardArrowUpOutlined,
    KeyboardArrowDownOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import ProductDetails from "./ProductDetails";
import PendingDetails from "./PendingDetails";
import CompletedDetails from "./CompletedDetails";
import PendingClaimDetails from "./PendingClaimDetails";
import LiveDetails from "./LiveDetails";
import {
    ChevronRightIcon,
    PackageSearch,
    PackageSearchIcon,
} from "lucide-react";
import SectionWrapper from "../../../../components/SectionWrapper";

const AuctionProductDetails = ({ productId, onClose, auction }) => {
    const [showTop, setShowTop] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDetailsOpen = () => setOpen(true);
    const handleDetailsClose = () => setOpen(false);

    const handleTop = (id) => {
        setShowTop((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    return (
        <>
            <Stack gap={3} sx={{ mt: 2 }}>
                <Stack>
                    <Typography variant="subtitle2" color="secondary">
                        Auctin and Product Info
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Comprehensive overview of the item details and auction
                        parameters
                    </Typography>
                </Stack>
                <Box
                    onClick={() => handleTop(auction._id)}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 1,
                        border: "1px solid gray",
                        px: 1,
                    }}
                >
                    <Button
                        sx={{ py: 2 }}
                        onClick={handleDetailsOpen}
                        fullWidth
                    >
                        <Stack
                            width={"100%"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            direction={"row"}
                        >
                            <Stack
                                alignItems={"center"}
                                gap={1}
                                direction={"row"}
                            >
                                <PackageSearchIcon />
                                <Typography
                                    variant="subtitle2"
                                    color="secondary"
                                >
                                    {auction.inventoryId?.productName}
                                </Typography>
                            </Stack>
                            <ChevronRightIcon />
                        </Stack>
                    </Button>
                </Box>
                <Divider />
                <Box>
                    {auction.status === "PENDING" && (
                        <PendingDetails data={auction} onClose={onClose} />
                    )}
                    {auction.status === "LIVE" && (
                        <LiveDetails data={auction} />
                    )}
                    {auction.status === "PENDING_CLAIM" && (
                        <PendingClaimDetails data={auction} />
                    )}
                    {auction.status === "COMPLETED" && (
                        <CompletedDetails data={auction} />
                    )}
                </Box>
            </Stack>
            <ProductDetails
                open={open}
                onClose={handleDetailsClose}
                product={auction.inventoryId}
            />
        </>
    );
};

export default AuctionProductDetails;
