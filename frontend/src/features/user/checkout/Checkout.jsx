import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../../contexts/CheckoutContext";
import BottomActionBar from "../../../components/BottomActionBar";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

export default function Checkout() {
    const { checkoutItems, totalAmount, isProcessing, checkout } = useCheckout();
    const navigate = useNavigate();

    if (!checkoutItems.length) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography>No items selected</Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/cart")}>
                    Back to Cart
                </Button>
            </Container>
        );
    }
    
    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Checkout
            </Typography>

            {checkoutItems.map((item) => (
                <Box key={item._id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography noWrap>
                        {item.productId.productName}
                    </Typography>
                    <Typography>
                        PHP {(item.productId.price ?? 0).toLocaleString('en-PH', {minimumFractionDigits: 2})}
                    </Typography>
                </Box>
            ))}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">PHP {totalAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}</Typography>
            </Box>

            <BottomActionBar>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Button
                        color="secondary"
                        onClick={() => navigate("/cart")}
                        sx={{ p: 0, height: 50 }}
                    >
                        <ChevronLeftRoundedIcon fontSize="large" />
                    </Button>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }} color="secondary">
                            PHP {totalAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => checkout()} // ✅ just call checkout from context
                            disabled={isProcessing}
                            sx={{ p: 1, px: 4, borderRadius: 2 }}
                        >
                            {isProcessing ? "Processing..." : "Checkout"}
                        </Button>
                    </Box>
                </Box>
            </BottomActionBar>
        </Container>
    );
}
