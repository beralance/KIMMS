import React, { useContext, useEffect } from "react";
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
} from "@mui/material";
import {AdjustRounded, RefreshRounded, EditRounded, KeyboardArrowDownRounded, KeyboardArrowUpRounded, QrCode, SortRounded} from "@mui/icons-material";
import { InventoryContext } from "../../../../contexts/InventoryContext";
import CustomPopover from '../../../../components/CustomPopover'
import dayjs from 'dayjs'
import PhysicalCodeDisplayer from './PhysicalCodeDisplayer'
import {Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

// Each row = 1 product
function Row({ product, open, onToggle }) {
    const [qrOpen, setQrOpen] = React.useState(false)
    const handleQrClose = () => setQrOpen(false)
    const handleQrOpen = () => setQrOpen(true)

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" }, boxShadow: 0}}>
                <TableCell>
                    {product.images?.length > 0 && (
                        <img
                            src={product.images[0]}
                            alt={product.productName}
                            style={{ width: 60, height: 60, objectFit: "cover", aspectRatio: '1/1', borderRadius: 5}}
                        />
                    )}
                </TableCell>
                <TableCell component="th" scope="row">
                    <CustomPopover 
                        trigger={
                            <Button sx={{p: 0}}>
                                <Typography color="initial" variant="body2" noWrap sx={{minWidth: 80, maxWidth: 100}}>
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
                <TableCell>{dayjs(product.createdAt).format('MM-DD-YYYY HH:mm')}</TableCell>
                
                <TableCell align="center">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={onToggle}
                    >
                        {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
                    </IconButton>
                </TableCell>
            </TableRow>

            {/* Expandable details */}
            <TableRow sx={{ bgcolor: "#f8f8f8"}} >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit sx={{pb: 2}}>
                        <Box>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 2}}>
                                <Typography variant="body1" fontWeight={'bold'}>
                                    Product Info
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1}}>
                                    <IconButton variant="outlined" color="secondary" onClick={handleQrOpen}>
                                        <QrCode/>
                                    </IconButton>
                                    <IconButton variant="outlined" color="secondary">
                                        <EditRounded/>
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
                            <Grid container>
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
                                    <Box sx={{ margin: 1, display: 'flex', alignItems: 'center'}}>
                                        <Typography variant="subtitle2" color="white" sx={{bgcolor: '#37353E', mr: 2, px: 2, py: .5, borderRadius: 1}}>
                                            Tags:
                                        </Typography>
                                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                            <Typography variant="subtitle2" gutterBottom color="secondary" sx={{border: 1, px: 2, py: .5, borderRadius: '999px'}}>
                                                {product.condition}
                                            </Typography>
                                            <Typography variant="subtitle2" gutterBottom color="secondary" sx={{border: 1, px: 2, py: .5, borderRadius: '999px'}}>
                                                {product.isLocal ? 'Local' : 'International'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ margin: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom color="white" sx={{bgcolor: '#37353E', px: 1, py: .5, borderRadius: 1}}>
                                            Description
                                        </Typography>
                                        <Typography variant="body2" sx={{p: .5, height: 50, overflowY: 'auto'}}>{product.description}</Typography>
                                    </Box>
                                    <Box sx={{ margin: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom color="white" sx={{bgcolor: '#37353E', px: 1, py: .5, borderRadius: 1}}>
                                            Details
                                        </Typography>
                                        <Typography variant="body2" sx={{p: .5, height: 50, overflowY: 'auto'}}>{product.details}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function InventoryTable({ searchTerm }) {
    const { inventoryItems, fetchInventoryItems } = useContext(InventoryContext);
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
        fetchInventoryItems();
    }, [inventoryItems])

    return (
        <>
            <TableContainer component={Paper} sx={{borderRadius: 2, boxShadow: 5}}>
                <Table aria-label="inventory table">
                    <TableHead>
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
                                    Created {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                {/*refresh button*/}
                                <IconButton
                                    sx={{ mt: 1 }}
                                    onClick={fetchInventoryItems} // refresh list
                                >
                                    <RefreshRounded sx={{color: 'white'}}/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedItems.length > 0 ? (
                            sortedItems.map((product, idx) => (
                                <Row
                                    key={idx} 
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
