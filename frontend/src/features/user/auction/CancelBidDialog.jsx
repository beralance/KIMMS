import React from "react";
import { Dialog, Box, Typography, Stack, Button } from "@mui/material";

export default function CancelBidDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6">Warning</Typography>
                <Typography>
                    If you cancel your bid, you will not be able to bid again on this product. Do you want to proceed?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onClose}>
                        No, Go Back
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Yes, Cancel
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
}
