import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, TextField, SwipeableDrawer, Container, Button, MenuItem, Select, InputLabel, FormControl, Typography, CircularProgress, Collapse, ListItem, ListItemText, Stack, IconButton, FormControlLabel, Switch, ButtonGroup, Divider } from "@mui/material";
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
import {CircleCheckIcon, InfoIcon} from 'lucide-react'
import { useSocket } from '../../../../contexts/SocketContext';

export default function ProductForm({productId, productData, onClose}) {
    // Product Data
    const [details, setDetails] = useState(productData?.details || '')
    const [price, setPrice] = useState(productData?.price || '');
    const [condition, setCondition] = useState(productData?.condition || '');
    
    const {updateProduct, deleteProduct, updateProductHighlight} = useContext(ProductContext)
    const {showSnackbar} = useSnackbar()

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isFeatured, setIsFeatured] = useState(productData.highlight === "featured");
    const [infoOpen, setInfoOpen] = useState(true)

    const [qrOpen, setQrOpen] = useState(false)
    const handleQrClose = () => setQrOpen(false)
    const handleQrOpen = () => setQrOpen(true)

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [open, setOpen] = useState(false)
    const toEdit = useRef(null)
    const socket = useSocket()

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
        socket.emit('postedProductDelete', {id})
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
            setInfoOpen(false)
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

    // remove
    const handleDeleteConfirmed = async () => {
        if (isFeatured) await updateProductHighlight(productData._id, "none");
        await handleDelete(productData._id);
        showSnackbar("Product deleted successfully", "success");
        setConfirmOpen(false);
    };

    console.log('product data', productData)
    return (
        <Container maxWidth='sm'>
            <Stack sx={{mt: 1}}>
                <Stack sx={{mb: 3}}>
                    <Stack sx={{mb: 3}}>
                        <Stack direction={'row'} justifyContent={'space-between'} px={1} alignItems={'center'}>
                            <Typography variant="body1" fontWeight={'bold'} color={isFeatured ? "secondary" : 'grey'} sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                {isFeatured ? 'Featured' : 'Add to featured'}
                                {isFeatured ? <CircleCheckIcon  style={{color: 'green'}}/> : <InfoIcon onClick={() => setInfoOpen((prev) => !prev)}/>}
                            </Typography>
                            <Switch color="secondary" checked={isFeatured} onChange={handleToggleFeatured} disabled={loading} />
                        </Stack>
                        <Collapse in={infoOpen}>
                            <Typography variant="body2" color="grey" sx={{p: 1}}>
                                Enabling this option will mark the product as Featured Product.<br />
                                Featured products are highlighted on the homepage.
                            </Typography>
                        </Collapse>
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
                                        style={{ width: "100%", height: "100%", borderRadius: 3, backgroundColor: 'white', objectFit: "cover", aspectRatio: '1/1' }}
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </Stack>

                <Stack>
                    <Stack gap={3}>
                        <Stack>
                            <Stack>
                                <Typography variant="body2" color="secondary" fontWeight={'bold'}>{productData.productName}</Typography>
                            </Stack>
                            <Stack direction={'row'}>
                                <Typography variant="body2" noWrap color="secondary">Php {formatNumber(productData.price)}</Typography>
                            </Stack>
                        </Stack>

                        <Divider/>

                        <Stack gap={5}>
                            <Stack gap={1}>
                                <Typography variant="body2" color="secondary" fontWeight={'bold'}>Tags: </Typography>
                                <Stack direction={'row'} gap={1} alignItems={'flex-start'} flexWrap={'wrap'}>
                                    <Stack direction={'row'} sx={{border: '1px solid gray', width: 'auto', px: 2, py: .5, borderRadius: '999px'}} alignItems={'center'} gap={1}>
                                        <Typography variant="body2" noWrap color="secondary">{productData.isLocal ? 'Local' : 'International'}</Typography>
                                    </Stack>
                                    <Stack direction={'row'} sx={{border: '1px solid gray', px: 2, py: .5, borderRadius: '999px'}} alignItems={'center'} gap={1}>
                                        <Typography variant="body2" noWrap color="secondary">{productData.condition}</Typography>
                                    </Stack>
                                    <Stack direction={'row'} sx={{border: '1px solid gray', px: 2, py: .5, borderRadius: '999px'}} alignItems={'center'} gap={1}>
                                        <Typography variant="body2" noWrap color="secondary">{productData.category?.name}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>

                            <Stack direction={'row'} justifyContent={'space-between'} sx={{maxWidth: 400}}>
                                <Stack>
                                    <Typography variant="body2" color="secondary" fontWeight={'bold'}> Date Posted:</Typography>
                                    <Typography variant="body2" color="secondary"> {dayjs(productData.createdAt).format('MMMM D, YYYY')}</Typography>
                                </Stack>
                                <Stack>
                                    <Typography variant="body2" color="secondary" fontWeight={'bold'}>Last Update:</Typography>
                                    <Typography variant="body2" color="secondary"> {dayjs(productData.updatedAt).format('MMMM D, YYYY')}</Typography>
                                </Stack>
                            </Stack>

                            <Stack>
                                <Typography variant="body2" color="secondary" fontWeight={'bold'}>Description</Typography>
                                <Typography variant="body2" color="secondary">{productData.description}</Typography>
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="secondary" fontWeight={'bold'}>Details</Typography>
                                <Typography variant="body2" color="secondary">{productData.details}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <>
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    swipeAreaWidth={40}
                    disableSwipeToOpen={false}
                    sx={{display: {xs: 'bloc', md: 'none'}}}
                    PaperProps={{
                        sx: {
                            borderRadius: '10px 10px 0px 0px',
                            height: '60vh',
                            minHeight: '10vh'
                        },
                    }}
                >
                    {/*Content*/}
                    <Box
                        sx={{
                            px: 2,
                            position: 'relative',
                        }}
                    >
                        <Box sx={{position: 'sticky', p: .5, display: 'flex', justifyContent: 'center', top: 5, right: 0, left: 0, margin: '0 auto', width: '100%'}}>
                            <Box sx={{width: 50, height: 2, borderRadius: '999px', bgcolor: 'gray', }}/>
                        </Box>
                        <Box sx={{mb: 1}}>
                            <Typography variant="body1" color="initial" sx={{pt: 2}}>
                                Update {productData.productName}
                            </Typography>
                        </Box>
                        <Divider/>
                        <Stack gap={2} sx={{overflowY: 'auto', my: 2, p: 1, height: '45vh'}}>
                            <Stack gap={3} >
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
                            <Box>
                                <Typography variant="body2" fontWeight={'bold'} color="gray">
                                    Note:
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Updating a published product will immediately apply your changes to the listing that the user are using.
                                </Typography>
                            </Box>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Update Product"}
                            </Button>
                        </Stack>
                    </Box>
                </SwipeableDrawer>
            </>
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
                id={productData.inventoryId}
                name={productData.productName} 
                category={productData.category}
                physicalCode={productData.physicalCode}
                status={productData.status}
                image={productData.images[0]}
                open={qrOpen} 
                onClose={handleQrClose}
            />
            <FullScreenLoader open={loading} message='Updating product...'/>
        </Container>
    );
}
