import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, TextField, Container, Button, MenuItem, Select, InputLabel, FormControl, Typography, CircularProgress, Collapse, ListItem, ListItemText, Stack, IconButton, FormControlLabel, Switch, ButtonGroup } from "@mui/material";
import { InventoryContext } from '../../../../contexts/InventoryContext';
import PhysicalCodeDisplayer from '../components/PhysicalCodeDisplayer';
import { useSnackbar } from '../../../../contexts/SnackbarContext'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import FullScreenLoader from '../../../../components/FullScreenLoader';
import {CheckBox, CheckRounded, CloseRounded, DeleteForeverRounded, DeleteRounded, EditOffRounded, EditRounded, FrontHand, KeyboardArrowDownRounded, KeyboardArrowUpRounded, QrCode, Update} from '@mui/icons-material'
import {deleteCategory, addCategory, fetchCategories} from '../../../../utils/categoryApi'
import dayjs from 'dayjs';
import {Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import { formatNumber } from '../../../../utils/stringUtils';
import { ProductContext } from '../../../../contexts/ProductContext';
import UpdateFloatingButton from './UpdateFloatingButton';

export default function ProductForm({productId, productData, onClose}) {
    // Product Data
    const [details, setDetails] = useState(productData?.details || '')
    const [price, setPrice] = useState(productData?.price || '');
    const [condition, setCondition] = useState(productData?.condition || '');
    
    const {updateProduct, deleteProduct, updateProductHighlight} = useContext(ProductContext)
    const {showSnackbar} = useSnackbar()

    const [statusLoading, setStatusLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isFeatured, setIsFeatured] = useState(productData.highlight === "featured");
    
    const [qrOpen, setQrOpen] = useState(false)
    const handleQrClose = () => setQrOpen(false)
    const handleQrOpen = () => setQrOpen(true)

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [open, setOpen] = useState(false)
    const toEdit = useRef(null)

    const scrollToEdit = () => {
        toEdit.current?.scrollIntoView({behavior: 'smooth'})
    }

    const handleCollapseOpen = () => {
        setOpen(true)
        scrollToEdit()
    }
    const handleCollapseClose = () => setOpen(false)

    const handleDelete = async (id) => {
        await deleteProduct(id);
    };
    useEffect(() => {
        setDetails(productData.details  || '');
        setPrice(productData.price?.toString()  || '');
        setCondition(productData.condition  || '');
    }, [productId])

    const handlePriceChange = (e) => {
        const {value} = e.target
        setPrice(formatNumber(value))
    };

    const handleToggleFeatured = async () => {
        const newHighlight = isFeatured ? "none" : "featured";
        setLoading(true);
        try {
            const updated = await updateProductHighlight(productData._id, newHighlight);
            if (!updated || updated.error) {
                showSnackbar("Max featured limit reached", "error");
                setIsFeatured(productData.highlight === "featured");
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
            setIsFeatured(productData.highlight === "featured");
        } finally {
            setLoading(false);
        }
    };
    const handleUpdate = async () => {
        setLoading(true)
        setSuccess(false)

        const updatedFields = {};
        const numericPrice = Number(price.replace(/,/g, ''))
        if (numericPrice !== productData.price) updatedFields.price = numericPrice;
        if (condition !== productData.condition) updatedFields.condition = condition;
        if (details !== productData.details) updatedFields.details = details;


        try {
            const updated = await updateProduct(productId, updatedFields)

            if (updated) {
                setSuccess(true)
                showSnackbar('Product updates successfully', 'success')
                onClose()
            }
            else {
                showSnackbar('Failed to update product', 'error')
            }
        }
        catch (err) {
            console.error('Error updating', err)
            showSnackbar('An error occured while updating', 'error')
        }
        finally {
            setLoading(false)
        }
    }

    console.log('KAHSDF', productData)
    // remove
    const handleDeleteConfirmed = async () => {
        if (isFeatured) await updateProductHighlight(productData._id, "none");
        await handleDelete(productData._id);
        showSnackbar("Product deleted successfully", "success");
        setConfirmOpen(false);
    };
    return (
        <Container maxWidth='sm'>
            <Stack>
                <Stack>
                    <Stack direction={'row'} px={1} alignItems={'center'}>
                        <Typography variant="body1" fontWeight={'bold'} color={isFeatured ? "secondary" : 'grey'} sx={{display: 'flex', gap: .5, alignItems: 'center'}}>
                            {isFeatured && <CheckRounded/>}
                            Featured
                        </Typography>
                        <Switch color="secondary" checked={isFeatured} onChange={handleToggleFeatured} disabled={loading} />
                    </Stack>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        navigation={true}
                        pagination={{clickable: true}}
                        modules={[Navigation, Pagination]}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            "--swiper-navigation-color": "#37353E", 
                            "--swiper-navigation-size": "30px",  
                            "--swiper-pagination-color": "#37353e",
                            "--swiper-pagination-bullet-inactive-color": "#ccc",
                            "--swiper-pagination-bullet-size": "8px",
                        }}
                    >
                        {Array.isArray(productData.images) && productData.images.length > 0 && (
                            productData.images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img
                                        src={img}
                                        alt={`${productData.productName}`}
                                        style={{ width: "100%", height: "100%", borderRadius: 10, boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.6)', backgroundColor: 'white', objectFit: "cover", aspectRatio: '1/1' }}
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </Stack>

                {/*Product Update Field*/}
                <Collapse in={open} ref={toEdit}>
                    <Stack>
                        <TextField
                            label="Price"
                            placeholder='PHP 0'
                            type="text"
                            value={price}
                            onChange={handlePriceChange}
                            required
                            InputLabelProps={{ sx: { color: "#37353E" } }}
                        />
                        <TextField
                            label="Details"
                            placeholder='Product specification...'
                            multiline
                            rows={5}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            required
                            InputLabelProps={{ sx: { color: "#37353E" } }}
                        />
                        <FormControl>
                            <InputLabel>Condition</InputLabel>
                            <Select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                label="Condition"
                            >
                                <MenuItem value='used'>Used</MenuItem>
                                <MenuItem value='refurbished'>Refurbished</MenuItem>
                                <MenuItem value='new'>New</MenuItem>
                                <MenuItem value='like new'>Like New</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <Button
                        variant='contained'
                        color='secondary'
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Update Product"}
                    </Button>
                </Collapse>

                {/*Collapsable Product Info*/}
                <Stack>
                    <Stack>
                        <Typography variant="body1" color="initial">{productData.description}</Typography>
                        <Typography variant="body1" color="initial">{productData.details}</Typography>
                        <Typography variant="body1" color="initial">{productData.price}</Typography>
                        <Typography variant="body1" color="initial">{productData.condition}</Typography>
                        <Typography variant="body1" color="initial">{productData.category?.name}</Typography>
                        <Typography variant="body1" color="initial">{productData.isLocal ? 'Local' : 'International'}</Typography>
                        <Typography variant="body1" color="initial"> Date Posted: {dayjs(productData.createdAt).format('MMMM D, YYYY')}</Typography>
                        <Typography variant="body1" color="initial"> Last Update: {dayjs(productData.updatedAt).format('MMMM D, YYYY')}</Typography>
                    </Stack>
                </Stack>
            </Stack>
            
            <Box>
                <FullScreenLoader open={loading} message='Updating product...'/>
            </Box>
            <UpdateFloatingButton
                qrClick={handleQrOpen}
                editClick={open ? handleCollapseClose : handleCollapseOpen}
                deleteClick={() => setConfirmOpen(true)}
            />
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
            <PhysicalCodeDisplayer 
                id={productData._id}
                name={productData.productName} 
                category={productData.category}
                physicalCode={productData.physicalCode}
                status={productData.status}
                image={productData.images[0]}
                open={qrOpen} 
                onClose={handleQrClose}
            />
        </Container>
    );
}
