import {
    Box,
    Button,
    Drawer,
    List,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import React from "react";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { CloseRounded } from "@mui/icons-material";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { OrderContext } from "../../../../contexts/OrderContext";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

const MIN_PURCHASE_TOTAL = 10000;

const RequirementDrawer = ({
    open,
    onClose,
    productId,
    productName,
    links = [],
    anchor = "top",
}) => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const navigate = useNavigate();
    const { orders } = useContext(OrderContext);
    const [hasValidPurchase, setHasValidPurchase] = useState(false);
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const userOrders = orders.filter(
            (o) =>
                o.userId?._id === user.userId &&
                o.orderStatus === "SUCCESSFUL" &&
                o.paymentStatus === "paid" &&
                o.orderType === "fixed"
        );
        const totalPurchase = userOrders.reduce(
            (sum, order) => sum + (order.finalPrice || 0),
            0
        );
        console.log("Total Purchase", totalPurchase);

        if (totalPurchase > 5000) {
            console.log("Valid for AUCTION!!");
            setHasValidPurchase(true);
        }
    }, [orders]);

    const handleUserInfo = () => {
        if (
            !user.address?.region ||
            !user.address?.street ||
            !user.address?.province ||
            !user.address?.city ||
            !user.address?.postalCode
        ) {
            showSnackbar(
                "Please complete your address inorder to proceed",
                "warning"
            );
            return;
        }
        if (!user.email || !user.fullName || !user.phoneNumber) {
            showSnackbar(
                "Please complete your account informations first inorder to proceed",
                "warning"
            );
            return;
        }
        if (!hasValidPurchase) {
            showSnackbar(
                "You do not meet the minimum purchase requirement to participate in this auction.",
                "warning"
            );
            return;
        }
        setOpenDialog(true);
    };
    return (
        <Box>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        borderRadius: "10px 10px 0px 0px",
                    },
                }}
            >
                <Stack sx={{ px: 2, pt: 1, pb: 3 }}>
                    <Box
                        sx={{ width: "100%", p: 2 }}
                        role="presentation"
                        onKeyDown={(event) => {
                            if (event.key === "Tab" || event.key === "Shift")
                                return;
                            onClose();
                        }}
                    >
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            sx={{ pb: 1 }}
                            justifyContent={"space-between"}
                        >
                            <Typography
                                variant="body1"
                                color="secondary"
                                fontWeight={"bold"}
                            >
                                Here's what you need:
                            </Typography>
                            <IconButton
                                sx={{ p: 0 }}
                                onClick={() => setOpenDialog(false)}
                            >
                                <CloseRounded />
                            </IconButton>
                        </Stack>
                        <ul style={{ paddingLeft: "20px" }}>
                            <li>
                                Participation requires a purchase history of at
                                least Php 10,000.
                            </li>
                            <li>Complete account information.</li>
                            <li>
                                Participants must maintain a positive order
                                history
                            </li>
                            <li>You must have a GCash account for payment</li>
                        </ul>
                    </Box>

                    {/* Add Backend here, check if user is eligable for auction based on auction rules*/}
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleUserInfo}
                        sx={{
                            borderRadius: "999px",
                        }}
                    >
                        Start bidding
                    </Button>
                </Stack>

                <ConfirmDialog
                    open={openDialog}
                    title="Join the Auction"
                    content={`By joining this auction, you can start placing bids for ${productName} item.`}
                    onConfirm={() =>
                        navigate(`/auction/listing/details/${productId}`)
                    }
                    onCancel={() => setOpenDialog(false)}
                    confirmText="Confirm"
                    cancelText="Cancel"
                    color="secondary"
                />
            </Drawer>
        </Box>
    );
};

export default RequirementDrawer;
