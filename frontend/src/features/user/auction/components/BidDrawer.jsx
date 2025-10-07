import React from "react";
import { Box, Typography, Button, Grid, Stack, Divider, Drawer } from "@mui/material";

export default function BidDrawer({
    open,
    onClose,
    increments,
    currentBid,
    totalPrice,
    bidStatus,
    onBidIncrement,
    onResetBid,
    onConfirmBid,
    onCancelClick,
}) {
    const isDisabled = bidStatus === "edited";

    const getConfirmButtonText = () => {
        if (bidStatus === "none") return "Confirm Bid";
        if (bidStatus === "submitted") return "Finish Edit";
        if (bidStatus === "edited") return "Bid Locked";
    };

    return (
        <Drawer anchor="bottom" open={open} onClose={onClose} disableEnforceFocus>
            <Box sx={{ p: 3, minHeight: 250, bgcolor: "#f5f5f5", display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6">Place Your Bid</Typography>
                <Typography variant="body2">
                    Click a button to increase your bid. You can edit your bid only once after submission.
                </Typography>

                <Divider />

                <Box>
                    <Typography>Current Bid: PHP {totalPrice?.toLocaleString()}</Typography>
                    {currentBid > 0 && <Typography>Added: PHP {currentBid?.toLocaleString()}</Typography>}
                </Box>

                <Grid container spacing={2} sx={{ my: 2 }}>
                    {increments.map((inc, idx) => (
                        <Grid item xs={4} key={idx}>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ width: "100%" }}
                                onClick={() => onBidIncrement(inc)}
                                disabled={isDisabled}
                            >
                                +{inc}
                            </Button>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        PHP {totalPrice}
                    </Typography>
                </Box>

                <Stack spacing={1}>
                    <Button variant="outlined" color="warning" onClick={onResetBid} disabled={isDisabled}>
                        Reset Bid
                    </Button>

                    {bidStatus === "submitted" && (
                        <Button variant="outlined" color="error" onClick={onCancelClick} disabled={isDisabled}>
                            Cancel Bid
                        </Button>
                    )}

                    <Button variant="contained" color="secondary" onClick={onConfirmBid} disabled={isDisabled}>
                        {getConfirmButtonText()}
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
