import React, { useContext, useState } from "react";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    CopyCheckIcon,
    CopyIcon,
    Divide,
    LocationEditIcon,
    MapPinIcon,
    XIcon,
} from "lucide-react";
import {
    Box,
    Drawer,
    Stack,
    Container,
    Typography,
    Tooltip,
    IconButton,
    Collapse,
    Divider,
    Button,
    Grid,
} from "@mui/material";
import OrderStatusStepper from "./OrderStatusStepper";
import SectionWrapper from "../../../components/SectionWrapper";
import ConfirmDialog from "../../../components/ConfirmDialog";
import FullScreenLoader from "../../../components/FullScreenLoader";
import dayjs from "dayjs";
import { formatNumber, toTitleCase } from "../../../utils/stringUtils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { OrderContext } from "../../../contexts/OrderContext";

const OrderDetailsDrawer = ({ order, open, onClose }) => {
    const { cancelOrder, orders } = useContext(OrderContext);
    const { showSnackbar } = useSnackbar();
    const [copied, setCopied] = useState(false);
    const [viewMore, setViewMore] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [infoMore, setInfoMore] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const address = order.userId?.address;
    const fullAddress = `${address?.street}, ${address?.city}, ${address?.province}, ${address?.region}, ${address?.postalCode}`;
    const totalAmount = order.products.reduce(
        (acc, product) =>
            acc + product?.productId?.price || product?.inventoryId?.price,
        0
    );

    const handleDialogOpen = () => setConfirmDialog(true);
    const handleDialogClose = () => setConfirmDialog(false);

    const handleCancelOrder = async (orderId) => {
        if (!order?._id) return;
        setLoading(true);

        try {
            const result = await cancelOrder(orderId);

            if (result.error) {
                showSnackbar("Cancel failed:", "warning");
                return;
            }
            showSnackbar("Order has been cancelled successfully:", "success");
            onClose?.();
            handleDialogClose();
        } catch (err) {
            console.error("Problem occured when cancelling order:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Drawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                sx={{
                    position: "relative",
                    width: "100%",
                    display: { xs: "block", md: "none" },
                }}
                PaperProps={{ sx: { height: "90vh" } }}
            >
                <Stack>
                    <Container
                        sx={{ bgcolor: "#f0f0f0ff", height: "100%", py: 3 }}
                    >
                        <Stack gap={2}>
                            <Box>
                                <Stack>
                                    <Typography
                                        variant="subtitle1"
                                        color="secondart"
                                    >
                                        Order Details
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        Order information for order{" "}
                                        {order.orderId}
                                    </Typography>
                                </Stack>
                                <IconButton
                                    aria-label=""
                                    onClick={onClose}
                                    sx={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                    }}
                                >
                                    <XIcon />
                                </IconButton>
                            </Box>
                            <SectionWrapper>
                                <Typography
                                    variant="body1"
                                    color="initial"
                                    gutterBottom
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <MapPinIcon /> Delivery Information
                                </Typography>
                                <Stack sx={{ p: 1 }} gap={0.5}>
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            {order.userId?.fullName}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            {toTitleCase(fullAddress)}
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Collapse in={infoMore}>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            {order.userId?.fullName}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            {order.userId?.isLocal
                                                ? "Local"
                                                : "International"}{" "}
                                            user
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            {order.userId?.phoneNumber ||
                                                "XXXXXXXXXXX"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            {order.userId?.email}
                                        </Typography>
                                    </Collapse>
                                    <Button
                                        variant="text"
                                        color="secondary"
                                        fullWidth
                                        sx={{ p: 0 }}
                                        onClick={() =>
                                            setInfoMore((prev) => !prev)
                                        }
                                    >
                                        {infoMore === true ? "Less" : "More"}
                                        {infoMore === true ? (
                                            <ChevronUpIcon />
                                        ) : (
                                            <ChevronDownIcon />
                                        )}
                                    </Button>
                                </Stack>
                            </SectionWrapper>
                            <SectionWrapper>
                                <Typography variant="body1" color="initial">
                                    Purchase Status:
                                </Typography>
                                <OrderStatusStepper
                                    orderStatus={order.purchaseStatus}
                                />
                            </SectionWrapper>
                            <SectionWrapper>
                                <Typography
                                    variant="body1"
                                    color="initial"
                                    gutterBottom
                                >
                                    {order.products.length > 1
                                        ? "Products"
                                        : "Product"}
                                </Typography>
                                <Stack gap={2}>
                                    {order.products.map((product) => (
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"space-between"}
                                            gap={5}
                                            key={product._id}
                                        >
                                            <Stack sx={{ width: "20%" }}>
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            product.productId
                                                                ?.images?.[0] ||
                                                            product.inventoryId
                                                                ?.images?.[0]
                                                        }
                                                        style={{
                                                            display: "block",
                                                            aspectRatio: "1/1",
                                                            borderRadius: "5px",
                                                            objectFit: "cover",
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                    />
                                                </Box>
                                            </Stack>
                                            <Stack
                                                width={"80%"}
                                                justifyContent={"space-evenly"}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={"bold"}
                                                    gutterBottom
                                                    color="secondary"
                                                >
                                                    {product.productId
                                                        ?.productName ||
                                                        product.inventoryId
                                                            ?.productName}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="secondary"
                                                >
                                                    {product.productId
                                                        ?.isLocal ||
                                                    product.inventoryId?.isLocal
                                                        ? "Large"
                                                        : "Small"}{" "}
                                                    item
                                                </Typography>
                                                <Stack direction={"row"}>
                                                    <Typography
                                                        variant="body2"
                                                        color="secondary"
                                                        sx={{
                                                            border: "1px solid gray",
                                                            borderRadius:
                                                                "999px",
                                                            px: 1,
                                                        }}
                                                    >
                                                        {toTitleCase(
                                                            product.productId
                                                                ?.category
                                                                ?.name ||
                                                                product
                                                                    .inventoryId
                                                                    ?.category
                                                                    ?.name
                                                        )}
                                                    </Typography>
                                                    <Divider
                                                        orientation="vertical"
                                                        sx={{ mx: 1 }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="secondary"
                                                        sx={{
                                                            border: "1px solid gray",
                                                            borderRadius:
                                                                "999px",
                                                            px: 1,
                                                        }}
                                                    >
                                                        {toTitleCase(
                                                            product.productId
                                                                ?.condition ||
                                                                product
                                                                    .inventoryId
                                                                    ?.condition
                                                        )}
                                                    </Typography>
                                                </Stack>
                                                <Typography
                                                    variant="body2"
                                                    color="secondary"
                                                    sx={{
                                                        alignSelf: "flex-end",
                                                    }}
                                                >
                                                    PHP{" "}
                                                    {formatNumber(
                                                        product.productId
                                                            ?.price ||
                                                            product.inventoryId
                                                                ?.price
                                                    )}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    ))}
                                    <Divider />
                                    <Stack
                                        justifyContent={"space-between"}
                                        direction={"row"}
                                    >
                                        <Typography
                                            variant="body2"
                                            fontWeight={"bold"}
                                            color="secondary"
                                        >
                                            Order total
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            PHP {formatNumber(totalAmount)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </SectionWrapper>
                            <SectionWrapper sx={{ gap: 1 }}>
                                <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                >
                                    <Typography variant="body2" color="initial">
                                        Order ID
                                    </Typography>
                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                        gap={1}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="initial"
                                        >
                                            {order.orderId}
                                        </Typography>
                                        <Tooltip title="Copy Order ID">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        order.orderId || ""
                                                    );
                                                    setCopied(true);
                                                    setTimeout(() => {
                                                        setCopied(false);
                                                    }, 2000);
                                                }}
                                            >
                                                {copied ? (
                                                    <CopyCheckIcon
                                                        style={{
                                                            color: "green",
                                                        }}
                                                    />
                                                ) : (
                                                    <CopyIcon />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                >
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                    >
                                        Paid by
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                    >
                                        {order.paymentMethod === "gcash"
                                            ? "GCash"
                                            : "Cash on Delivery"}
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Collapse
                                    in={viewMore}
                                    unmountOnExit
                                    mountOnEnter
                                >
                                    <Stack gap={0.5}>
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"space-between"}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                Order Time
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                {dayjs(order.createdAt).format(
                                                    "MMMM D, YYYY - h:mm A"
                                                )}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"space-between"}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                Transaction Ref
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                {order.transactionReference}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Collapse>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    onClick={() => setViewMore((prev) => !prev)}
                                >
                                    {!viewMore ? "View more" : "View Less"}
                                    {!viewMore ? (
                                        <ChevronDownIcon />
                                    ) : (
                                        <ChevronUpIcon />
                                    )}
                                </Button>
                            </SectionWrapper>
                            {order.purchaseStatus === "pending" && (
                                <Stack>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        onClick={() => handleDialogOpen()}
                                        sx={{
                                            bgcolor: "rgba(255, 255, 255, 0.5)",
                                        }}
                                    >
                                        Cancel Order
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </Container>
                </Stack>
            </Drawer>
            <ConfirmDialog
                open={confirmDialog}
                title="Cancel Order?"
                content={`Are you sure you want to cancel ${order?.userId?.fullName}'s order?`}
                onConfirm={() => handleCancelOrder(order?._id)}
                onCancel={() => handleDialogClose()}
                color="error"
                confirmText="Yes, Cancel Order"
                cancelText="No"
            />
            <FullScreenLoader open={loading} />
        </Box>
    );
};

export default OrderDetailsDrawer;
