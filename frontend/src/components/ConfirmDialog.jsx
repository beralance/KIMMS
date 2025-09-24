// src/components/common/ConfirmDialog.jsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Container,
} from "@mui/material";

export default function ConfirmDialog({
    open,
    title = "Confirm Action",
    content = "Are you sure?",
    onConfirm,
    onCancel,
    confirmText = "Yes",
    cancelText = "Cancel",
}) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle sx={{fontSize:20}}>{title}</DialogTitle>
            <DialogContent sx={{maxWidth: 400, px: 4}}>
                <DialogContentText sx={{fontSize:15}}>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
