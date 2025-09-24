// src/components/productManagement/ProductCard.jsx
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Switch, FormControlLabel, Box, IconButton, Stack } from "@mui/material";
import { UPLOADS_URL } from '../../../../utils/constants';
import { useContext, useState } from "react";
import { ProductContext } from "../../../../contexts/ProductContext";
import { useSnackbar } from '../../../../contexts/SnackbarContext'
import ConfirmDialog from "../../../../components/ConfirmDialog";
import { CheckRounded, DeleteRounded, EditRoadRounded, EditRounded } from '@mui/icons-material'
import CustomPopover from '../../../../components/CustomPopover'

export default function ProductCard({ product, onEdit, onDelete }) {
    const { updateProductHighlight, updateProductStatus } = useContext(ProductContext);
    const [isFeatured, setIsFeatured] = useState(product.highlight === "featured");
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    const handleToggleFeatured = async () => {
        const newHighlight = isFeatured ? "none" : "featured";
        setLoading(true);
        try {
            const updated = await updateProductHighlight(product._id, newHighlight);
            if (!updated || updated.error) {
                showSnackbar("Max featured limit reached", "error");
                setIsFeatured(product.highlight === "featured");
                return;
            }
            setIsFeatured(updated.highlight === "featured");
            showSnackbar(
                updated.highlight === "featured"
                    ? "Product marked as featured"
                    : "Product removed from featured",
                "success"
            );
        } catch (err) {
            showSnackbar("Reached maximum limit", "error");
            setIsFeatured(product.highlight === "featured");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirmed = async () => {
        if (isFeatured) await updateProductHighlight(product._id, "none");
        await onDelete(product._id);
        showSnackbar("Product deleted successfully", "success");
        setConfirmOpen(false);
    };

    // ✅ Handle approve/reject
    const handleStatusChange = async (newStatus) => {
        setStatusLoading(true);
        const updated = await updateProductStatus(product._id, newStatus);
        if (updated.error) {
            showSnackbar(updated.error, "error");
        } else {
            showSnackbar(`Product ${newStatus}`, "success");
        }
        setStatusLoading(false);
    };

    return (
        <>
            <Card sx={{ maxWidth: 320, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{position: 'relative'}}>
                    <Box>
                        <img 
                            src={product.images ? `${UPLOADS_URL}${product.images[1]}` : "/placeholder-image.png"} 
                            alt={product.productName}
                            style={{
                                objectFit: 'cover',
                                aspectRatio: '9/10',
                                width: '100%',
                                height: '100%'
                            }}  
                        />
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 7, right: 0, borderRadius: 20, overflow: 'hidden'}}>
                        <Box sx={{display: "flex", gap: 1, p: 1, backdropFilter: 'blur(10px)', WebkitBackdropFilter: "blur(10px)"}}>
                            <IconButton size="small" color="primary" sx={{p:0}} onClick={() => onEdit(product._id)}>
                                <EditRounded/>
                            </IconButton>
                            <IconButton size="small" color="error" sx={{p:0}} onClick={() => setConfirmOpen(true)}>
                                <DeleteRounded/>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
                <CardContent sx={{py: 1}}>
                    <CustomPopover 
                        trigger={
                            <Button sx={{p: 0}}>
                                <Typography color="initial" variant="body1" noWrap sx={{maxWidth: 150}}>
                                    {product.productName}
                                </Typography>
                            </Button>
                        }
                    >
                        <p>{product.productName}</p>
                    </CustomPopover>
                    <Typography variant="body2" color="textSecondary">{product.category?.name}</Typography>
                    <Typography variant="body1">₱{product.price}</Typography>
                </CardContent>
                <CardActions>
                    <Stack direction={'row'} px={1} alignItems={'center'} width={'100%'} justifyContent={'space-between'}>
                        <Typography variant="body1" fontWeight={'bold'} color={isFeatured ? "secondary" : 'grey'} sx={{display: 'flex', gap: .5, alignItems: 'center'}}>
                            {isFeatured && <CheckRounded/>}
                            Featured
                        </Typography>
                        <Switch color="secondary" checked={isFeatured} onChange={handleToggleFeatured} disabled={loading} />
                    </Stack>
                </CardActions>
            </Card>

            <ConfirmDialog
                open={confirmOpen}
                title="Delete Product"
                content={isFeatured
                    ? "This product is featured. Deleting it will also remove it from featured. Are you sure?"
                    : "Are you sure you want to delete this product?"}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}
