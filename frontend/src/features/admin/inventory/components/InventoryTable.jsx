import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Grid,
    Button,
    Stack,
    Divider,
} from "@mui/material";
import {AdjustRounded, RefreshRounded, EditRounded, KeyboardArrowDownRounded, KeyboardArrowUpRounded, QrCode, SortRounded, DeleteRounded} from "@mui/icons-material";
import { InventoryContext } from "../../../../contexts/InventoryContext";
import CustomPopover from '../../../../components/CustomPopover'
import dayjs from 'dayjs'
import PhysicalCodeDisplayer from './PhysicalCodeDisplayer'
import {Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import UpdateDialog from './UpdateDialog'
import UpdateDrawer from './UpdateDrawer'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import RefreshButton from "../RefreshButton";


// Each row = 1 product
function Row({ product, open, onToggle, deleteItem }) {
    const [qrOpen, setQrOpen] = React.useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false)
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleQrClose = () => setQrOpen(false)
    const handleQrOpen = () => setQrOpen(true)
    const handleUpdateClose = () => setOpenUpdateDialog(false)
    const handleUpdateOpen = () => setOpenUpdateDialog(true)

    const handleDeleteClick = (product) => {
        setItemToDelete(product);
        setOpenConfirm(true);
    };
    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await deleteItem(itemToDelete._id);
            setOpenConfirm(false);
            setItemToDelete(null); // clear selection
        }
    };
    const handleConfirmClose = () => {
        setOpenConfirm(false);
        setItemToDelete(null);
    };

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" }, boxShadow: 0, borderBottom: open && '1px solid #cfcfcfff', m: 0}}>
                <TableCell>
                    {product.images?.length > 0 && (
                        <img
                            src={product.images[0]}
                            alt={product.productName}
                            style={{ width: 60, height: 60, display: 'block', objectFit: "cover", aspectRatio: '1/1', borderRadius: 5}}
                        />
                    )}
                </TableCell>
                <TableCell component="th" scope="row">
                    <CustomPopover 
                        trigger={
                            <Button sx={{p: 0}}>
                                <Typography color="secondary" fontWeight={'bold'} variant="body2" noWrap sx={{minWidth: 80, maxWidth: 100}}>
                                    {product.productName}
                                </Typography>
                            </Button>
                        }
                    >
                        <p>{product.productName}</p>
                    </CustomPopover>
                </TableCell>
                <TableCell component="th" scope="row">{product.physicalCode}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>PHP {product.price}</TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight={'bold'} color="secondary">
                        {dayjs(product.createdAt).format('MMMM D, YYYY')}
                    </Typography>
                    <Typography variant="body2" color="grey">
                        {dayjs(product.createdAt).format('h:mm A')}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Button
                        aria-label="expand row"
                        size="small"
                        onClick={onToggle}
                        sx={{height: '50px', width: '100%'}}
                    >
                        {open ? <KeyboardArrowUpRounded sx={{color: 'black'}}/> : <KeyboardArrowDownRounded sx={{color: 'black'}}/>}
                    </Button>
                </TableCell>
            </TableRow>

            {/* Expandable details */}
            <TableRow sx={{ bgcolor: "#f8f8f8"}} >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit sx={{pb: 2}}>
                        <Box>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 2}}>
                                <Typography variant="body1" fontWeight={'bold'}>
                                    {product.productName}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1}}>
                                    <IconButton variant="outlined" color="secondary" onClick={handleQrOpen}>
                                        <QrCode/>
                                    </IconButton>
                                    <IconButton variant="outlined" color="secondary" onClick={handleUpdateOpen}>
                                        <EditRounded/>
                                    </IconButton>
                                    <IconButton variant="outlined" color="secondary" onClick={() => handleDeleteClick(product)}>
                                        <DeleteRounded color="error"/>
                                    </IconButton>
                                </Box>
                                <PhysicalCodeDisplayer 
                                    id={product._id}
                                    name={product.productName} 
                                    category={product.category}
                                    physicalCode={product.physicalCode}
                                    status={product.status}
                                    image={product.images[0]}
                                    open={qrOpen} 
                                    onClose={handleQrClose}
                                />
                            </Box>
                            <Divider/>
                            <Grid container sx={{pt: 3}}>
                                <Grid size={{xs: 4}}>
                                    <Box sx={{width: '100%', maxWidth: {xs: 600, md: 700, lg: 800}}}>
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
                                            {Array.isArray(product.images) && product.images.length > 0 && (
                                                product.images.map((img, idx) => (
                                                    <SwiperSlide key={idx}>
                                                        <Box sx={{height: {xs: 200, md: 220}, width: {xs: 200, md: 220}, justifySelf: 'center'}}>
                                                            <img
                                                                src={img}
                                                                alt={`${product.productName}`}
                                                                style={{ width: "100%", height: "100%", borderRadius: 10, boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.6)', backgroundColor: 'white', objectFit: "cover", aspectRatio: '1/1' }}
                                                            />
                                                        </Box>
                                                    </SwiperSlide>
                                                ))
                                            )}
                                        </Swiper>
                                    </Box>
                                </Grid>
                                <Grid size={{xs: 8}}>
                                    <Stack gap={1}>
                                        {/* Tags */}
                                        <Grid container spacing={2} sx={{display: 'flex'}}>
                                            <Grid size={{xs: 6}}>
                                                <Stack gap={1}>
                                                    <Typography variant="subtitle2" color="white" sx={{bgcolor: '#37353E', py: .5, px: 2, borderRadius: 1}}>
                                                        Tags:
                                                    </Typography>
                                                    <Stack direction={'row'} sx={{px: 1}}>
                                                        <Typography variant="body1" color="secondary" sx={{px: 2, borderRadius: '999px', border: 1}}>
                                                            {product.condition}
                                                        </Typography>
                                                        <Divider orientation="vertical" sx={{height: 20, mx: 1,}}/>
                                                        <Typography variant="body1" color="secondary" sx={{px: 2, borderRadius: '999px', border: 1}}>
                                                            {product.isLocal ? 'Local' : 'International'}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid size={{xs: 6}}>
                                                {/*Last Update*/}
                                                <Stack gap={1}>
                                                    <Typography variant="subtitle2" color="white" sx={{bgcolor: '#37353E', py: .5, px: 2, borderRadius: 1}}>
                                                        Last Update: 
                                                    </Typography>
                                                    <Stack sx={{px: 1}}>
                                                        <Typography variant="body1" color="initial">
                                                            {product.updatedAt 
                                                                ? dayjs(product.updatedAt).format('MMMM D, YYYY') 
                                                                : 'Not Updated Yet'}
                                                        </Typography>
                                                        <Divider orientation="vertical"/>
                                                        <Typography variant="body2" color="grey">
                                                            {product.updatedAt 
                                                                ? dayjs(product.updatedAt).format('h:mm A') 
                                                                : ''}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                        </Grid>

                                        {/*About Product*/}
                                        <Grid container spacing={2} display={'flex'}>
                                            <Grid size={{xs: 6}}>
                                                <Typography variant="subtitle2" gutterBottom color="white" sx={{bgcolor: '#37353E', px: 1, py: .5, borderRadius: 1}}>
                                                    Description
                                                </Typography>
                                                <Typography variant="body2" sx={{p: .5, height: 50, overflowY: 'auto'}}>{product.description}</Typography>
                                            </Grid>
                                            <Grid size={{xs: 6}}>
                                                <Typography variant="subtitle2" gutterBottom color="white" sx={{bgcolor: '#37353E', px: 1, py: .5, borderRadius: 1}}>
                                                    Details
                                                </Typography>
                                                <Typography variant="body2" sx={{p: .5, height: 50, overflowY: 'auto'}}>{product.details}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <ConfirmDialog 
                open={openConfirm} 
                title = "Delete Item"
                content = {`You're about to delete "${itemToDelete?.productName}". Once deleted, this item cannot be recovered.`}
                onConfirm = {() => handleConfirmDelete(itemToDelete._id)}
                onCancel = {handleConfirmClose}
                confirmText = "DELETE"
                cancelText = "Cancel"
                color = 'error'
            />
            <UpdateDialog open={openUpdateDialog} onClose={handleUpdateClose} title={product.productName} content={'update-inventory'} id={product._id}/>
            <UpdateDrawer open={openUpdateDialog} onClose={handleUpdateClose} title={product.productName} content={'update-inventory'} id={product._id}/>
        </React.Fragment>
    );
}

export default function InventoryTable({ searchTerm }) {
    const { inventoryItems, deleteInventoryItem, fetchInventoryItems } = useContext(InventoryContext);
    const [sortConfig, setSortConfig] = React.useState({key: null, direction: 'asc'})
    const [open, setOpen] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    // filter here before rendering
    const filteredItems = inventoryItems.filter((product) => {
        if (!searchTerm) return true; // no search, return all
        const search = searchTerm.toLowerCase();
        const query = search.toLowerCase().replace(/-/g, "");

        return (
            product.productName?.toLowerCase().includes(query) ||
            product.category?.name?.toLowerCase().includes(query) ||
            product.physicalCode?.toLowerCase().replace(/-/g, '').includes(query) ||
            product._id?.toLowerCase().includes(query)
        );
    });

    const handleSort = (key) => {
        setOpen(null)
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {key, direction: prev.direction === 'asc' ? 'desc' : 'asc'}
            }
            return { key, direction: 'asc'} // new column, default
        })
    }

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue, bValue;

        if (sortConfig.key === "category") {
            aValue = a.category?.name ?? "";
            bValue = b.category?.name ?? "";
        } else if (sortConfig.key === "createdAt") {
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
        } else {
            aValue = a[sortConfig.key] ?? "";
            bValue = b[sortConfig.key] ?? "";
        }

        // Date sort
        if (aValue instanceof Date && bValue instanceof Date && !isNaN(aValue) && !isNaN(bValue)) {
            return sortConfig.direction === "asc"
                ? aValue - bValue
                : bValue - aValue;
        }

        // String sort
        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        // Number sort
        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    useEffect(() => {
        fetchInventoryItems()
    }, [])

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await fetchInventoryItems();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{borderRadius: 2, maxHeight: '80vh', overflowY: 'auto'}}>
                <Table aria-label="inventory table">
                    <TableHead sx={{position: 'sticky', top: 0, boxShadow: 5}}>
                        <TableRow sx={{bgcolor: '#37353E'}}>
                            <TableCell/>
                            <TableCell sx={{ cursor: 'pointer'}} onClick={() => handleSort('productName')}>
                                <Typography fontWeight='bold' variant="subtitle2" color="white" noWrap width={120}>
                                    Product {sortConfig.key === 'productName' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleSort('physicalCode')}>
                                <Typography fontWeight='bold' variant="subtitle2" color="white" noWrap width={120}>
                                    Physical Code {sortConfig.key === 'physicalCode' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleSort('category')}>
                                <Typography fontWeight='bold' variant="subtitle2" color="white" noWrap width={120}>
                                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleSort('price')}>
                                <Typography fontWeight='bold' variant="subtitle2" color="white" noWrap width={120}>
                                    Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleSort('createdAt')}>
                                <Typography fontWeight='bold' variant="subtitle2" color="white" noWrap width={120}>
                                    Date Created {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                {/*refresh button*/}
                                <RefreshButton sx={{color: 'white'}} onRefresh={handleRefresh} tooltip="Refresh inventory"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedItems.length > 0 ? (
                            sortedItems.map((product, idx) => (
                                <Row
                                    key={idx} 
                                    deleteItem={deleteInventoryItem}
                                    product={product}
                                    open={open === product._id}
                                    onToggle={() => setOpen(open === product._id ? null : product._id)}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </> 
    );
}
