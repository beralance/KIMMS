// src/components/productManagement/ProductCard.jsx
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Switch, FormControlLabel, Box, IconButton, Stack, Divider, Container } from "@mui/material";
import { useContext, useState } from "react";
import { ProductContext } from "../../../../contexts/ProductContext";
import { useSnackbar } from '../../../../contexts/SnackbarContext'
import ConfirmDialog from "../../../../components/ConfirmDialog";
import { CheckRounded, DeleteRounded, EditRoadRounded, EditRounded, QrCode } from '@mui/icons-material'
import CustomPopover from '../../../../components/CustomPopover'
import {toTitleCase} from '../../../../utils/stringUtils'
import dayjs from "dayjs";
import { formatNumber } from "../../../../utils/stringUtils";
import { handleImageError } from "../../../../utils/imageErrorHandler";
import UpdateDialog from './UpdateDialog'
import UpdateDrawer from './UpdateDrawer'


export default function ProductCard({ product, onEdit, onDelete }) {
    const { updateProductHighlight, updateProductStatus } = useContext(ProductContext);
    const [isFeatured, setIsFeatured] = useState(product.highlight === "featured");
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

    const handleUpdateClose = () => setOpenUpdateDialog(false)
    const handleUpdateOpen = () => setOpenUpdateDialog(true)

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

    // remove
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
            <Card sx={{ maxWidth: 320, borderRadius: 0, boxShadow: 0, bgcolor: 'transparent' }}>
                <Box sx={{position: 'relative'}}>
                    <Box onClick={handleUpdateOpen} sx={{cursor: 'pointer', boxShadow: 5, borderRadius: 1, overflow: 'hidden'}}>
                        <img 
                            src={`${product.images[1]}`} 
                            alt={product.productName}
                            onError={(e) => (handleImageError(e))}
                            style={{
                                objectFit: 'cover',
                                aspectRatio: '9/10',
                                width: '100%',
                                height: '100%',
                                display: 'block'
                            }}  
                        />
                    </Box>
                </Box>
                <CardContent sx={{p: 0, pb: '5px !important', m: 1,}}>
                    <Stack>
                        <CustomPopover 
                            trigger={
                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    <Typography 
                                        color="initial" 
                                        variant="body1"
                                        noWrap
                                    >
                                        {product.productName}
                                    </Typography>
                                </Box>
                            }
                        >
                            <p>{product.productName}</p>
                        </CustomPopover>
                        <Typography variant="body2" component={'div'} color="grey" sx={{display: 'flex'}}>
                            <Stack sx={{border: 1, my: .5, mr: .5}}/>
                            <Stack gap={.5} direction={'row'}>
                            <b>PHP</b> {formatNumber(product.price)}
                            </Stack>
                        </Typography>

                    </Stack>
                    <Divider/>
                    <Stack>
                        <Typography 
                            variant="body2" 
                            color="textSecondary"
                            noWrap
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}
                        >
                            {product.category?.name}
                        </Typography>
                        <Typography variant="body2">
                            {dayjs(product.createdAt).format('MMMM D, YYYY h:mm A')}
                        </Typography>
                    </Stack>
                </CardContent>
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
            <UpdateDialog open={openUpdateDialog} productData={product} onClose={handleUpdateClose} title={product.productName} content={'update-product'} id={product._id}/>
            <UpdateDrawer open={openUpdateDialog} productData={product} onClose={handleUpdateClose} title={product.productName} content={'update-product'} id={product._id}/>
        </>
    );
}
