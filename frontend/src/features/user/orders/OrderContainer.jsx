import React, { useState } from "react";
import { ChevronRightIcon, XIcon } from "lucide-react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Divider,
    Button,
} from "@mui/material";
import ProductCard from "./ProductCard";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import SectionWrapper from "../../../components/SectionWrapper";
import dayjs from "dayjs";
import { formatNumber, toTitleCase } from "../../../utils/stringUtils";

const OrderContainer = ({ order }) => {
    const [openDetails, setOpenDetails] = useState(false);

    const handleDetailsOpen = () => setOpenDetails(true);
    const handleDetailsClose = () => setOpenDetails(false);

    const totalAmount = order.products.reduce(
        (acc, product) =>
            acc + product?.productId?.price || product?.inventoryId?.price,
        0
    );

    return (
        <Box>
            <SectionWrapper sx={{ bgcolor: "#f5f5f5ff", borderRadius: 1, position: 'relative'}}>
                {(order.purchaseStatus === 'cancelled' && order.orderStatus === 'CANCELLED') && 
                    <Box sx={{top: 0, left: 0, bgcolor: 'red', height: 15, width: 15, position: 'absolute', borderRadius: .5}}/>
                }
                {(order.purchaseStatus === 'delivered' && order.orderStatus === 'SUCCESSFUL') && 
                    <Box sx={{top: 0, left: 0, bgcolor: 'green', height: 15, width: 15, position: 'absolute', borderRadius: .5}}/>
                }
                <Stack sx={{ gap: 2 }}>
                    {/*ORDER ID*/}
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        gap={1}
                    >
                        <Stack direction={"row"} gap={1}>
                            <Typography variant="body2" color="initial">
                                Order ID:
                            </Typography>
                            <Typography variant="body2" color="secondary">
                                {order.orderId}
                            </Typography>
                        </Stack>
                        <IconButton aria-label="" onClick={handleDetailsOpen}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Stack>
                    <Stack gap={2}>
                        {order.products.map((product) => (
                            <Box key={product._id}>
                                <ProductCard product={product} />
                            </Box>
                        ))}
                    </Stack>
                    <Divider />
                    <Stack gap={2}>
                        <Stack>
                            {order.orderType !== "fixed" && (
                                <Typography variant="body1" color="warning">
                                    Auction Purchase
                                </Typography>
                            )}
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                            >
                                <Typography variant="body2" color="secondary">
                                    Paid by
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    {order.paymentMethod === "gcash"
                                        ? "GCash"
                                        : "Cash on Delivery"}
                                </Typography>
                            </Stack>
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                            >
                                <Typography variant="body2" color="secondary">
                                    Order total
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    Php {formatNumber(totalAmount)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </SectionWrapper>
            <OrderDetailsDrawer
                open={openDetails}
                onClose={handleDetailsClose}
                order={order}
            />
        </Box>
    );
};

export default OrderContainer;
