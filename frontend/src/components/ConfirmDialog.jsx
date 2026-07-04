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
    color = 'error'
}) {
    return (
        <Dialog open={open} onClose={onCancel} sx={{minWidth: 250}}>
            <DialogTitle sx={{fontSize:20}} variant="body1">{title}</DialogTitle>
            <DialogContent sx={{maxWidth: 400, minWidth: 200, px: 4}}>
                <DialogContentText sx={{fontSize:15}} variant="body2">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color={color}
                    variant="contained"
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
