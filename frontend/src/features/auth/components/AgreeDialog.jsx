import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Link,
    Box,
} from "@mui/material";
import { acceptTerms } from "../../../utils/api";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const TermsDialog = ({ open, onAccept, onClose, onDecline }) => {
    const [checked, setChecked] = useState(false);
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();

    const handleAccept = async () => {
        try {
            await acceptTerms(user.userId);
            onClose(true);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Dialog open={open} disableEscapeKeyDown>
            <DialogTitle sx={{ fontWeight: "bold" }}>Almost there…</DialogTitle>

            <DialogContent>
                <Typography variant="body2" mb={2}>
                    Welcome to <b>Kimm’s Furniture & Merchandise</b>. Before
                    continuing, please read and accept our{" "}
                    <Link href="/terms" target="_blank">
                        Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank">
                        Privacy Policy
                    </Link>
                    .
                </Typography>

                <Box
                    sx={{
                        border: "1px solid #ddd",
                        p: 2,
                        borderRadius: 2,
                        maxHeight: 120,
                        overflowY: "auto",
                        background: "#fafafa",
                    }}
                >
                    <Typography variant="caption">
                        By using this platform you agree that your data may be
                        collected and processed to improve your shopping
                        experience. You also agree to follow platform rules and
                        policies.
                    </Typography>
                </Box>

                <FormControlLabel
                    sx={{ mt: 2 }}
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                    }
                    label="I have read and agree to the Terms & Conditions and Privacy Policy."
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onDecline} color="error">
                    Decline
                </Button>
                <Button
                    variant="contained"
                    disabled={!checked}
                    onClick={onAccept}
                >
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TermsDialog;
