import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Checkbox, Grid, Stack, List, ListItem, Divider, Grow, ButtonGroup, Collapse, IconButton, Fade } from "@mui/material";
import { useCart } from "../../../contexts/CartContext";
import { useCheckout } from "../../../contexts/CheckoutContext";
import { NavLink, useNavigate } from "react-router-dom";
import BottomActionBar from "../../../components/BottomActionBar";
import SectionWrapper from "../../../components/SectionWrapper";
import {DeleteRounded, DoneAllRounded, KeyboardArrowDownRounded, KeyboardArrowUpRounded, RemoveDoneRounded } from '@mui/icons-material'
import { toTitleCase, formatNumber } from '../../../utils/stringUtils'
import { useSnackbar } from "../../../contexts/SnackbarContext";
import {ShoppingBagIcon} from 'lucide-react'


export default function Cart() {
    const { cartItems, removeFromCart } = useCart();
    const { setCheckoutItems } = useCheckout();
    const [selectedIds, setSelectedIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const {showSnackbar} = useSnackbar()
    const [summaryOpen, setSummaryOpen] = useState(false)
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const address = user.address

    // Only consider valid products
    const validCartItems = cartItems.filter(item => item.productId);

    // Calculate total price whenever selection or cart changes
    useEffect(() => {
        const selectedItems = validCartItems.filter(item =>
            selectedIds.includes(item.productId._id)
        );
        const total = selectedItems.reduce(
            (acc, item) => acc + ((item.productId.price ?? 0) * (item.quantity ?? 1)),
            0
        );
        setTotalPrice(total);
    }, [selectedIds, validCartItems]);

    if (!validCartItems.length) {
        return (
            <Stack sx={{height: '80vh', justifyContent: 'center', alignItems: 'center'}}>
                <Grow in={true} mountOnEnter unmountOnExit timeout={1000}>
                    <Box sx={{width: 80}}>
                        <img src="emoji-sick-svgrepo-com.svg" alt="emoji-sick" style={{width: '100%', objectFit: 'cover'}} />
                    </Box>
                </Grow>
                <Typography variant="h6" fontWeight='bold'>Your cart is empty</Typography>
                <Typography variant="body2" color="grey">Click the button below to browse our products</Typography>
                <Fade mountOnEnter unmountOnExit in={true} timeout={600}>
                    <Button variant="contained" sx={{borderRadius: '999px', width: 150, py: 1, my: 4}} color="secondary" component={NavLink} to='/shop'>
                        Browse Product
                    </Button>
                </Fade>
            </Stack>
        )
    }

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === validCartItems.length) {
            setSelectedIds([]); // unselect all
        } else {
            setSelectedIds(validCartItems.map(item => item.productId._id)); // select all
        }
    };

    const handleRemoveSelected = async () => {
        for (const id of selectedIds) {
            await removeFromCart(id);
        }
        setSelectedIds([])
    };

    const handleCheckout = () => {
        if (!selectedIds.length) {
            showSnackbar("Please select at least one item to checkout.", 'warning');
            return;
        }
        const itemsToCheckout = validCartItems.filter(item =>
            selectedIds.includes(item.productId._id)
        );
        console.log('CHECKOUT ITEMS', itemsToCheckout)
        setCheckoutItems(itemsToCheckout);
        navigate("/checkout", { replace: true });
    };

    const selectedItemsDetails = validCartItems
        .filter(item => selectedIds.includes(item.productId._id))
        .map(item => ({
            name: item.productId.productName,
            price: item.productId.price,
        }))
        
    return (
        <Container sx={{ pb: {xs: "120px", md: 0 }}}>

            {/* Mobile On*/}
            <Box sx={{ display: {xs: "flex", md: 'none'}, mb: 2, justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    Shopping Cart
                    <ShoppingBagIcon/>
                </Typography>
                <Box>
                    {selectedIds.length > 0 && (
                        <Button variant="text" color="error" onClick={handleRemoveSelected}>
                            <DeleteRounded fontSize="small" sx={{mr: 1}}/>
                        </Button>
                    )}
                    <Button variant={selectedIds.length === validCartItems.length ? 'contained' : 'text'} color="secondary" onClick={handleSelectAll}>
                        {selectedIds.length === validCartItems.length ? <RemoveDoneRounded fontSize="small" sx={{mr: 1}}/> : <DoneAllRounded fontSize="small" sx={{mr: 1}}/>}
                    </Button>
                </Box>
            </Box>
            <Stack gap={2}>
                <Box sx={{display: {xs: 'block', md: 'none'}}}>
                    <SectionWrapper>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                            <Typography variant="subtitle2" color="initial" fontWeight='bold'>
                                Shipping Address:
                            </Typography>
                            <Button variant="outlined" color="secondary" onClick={() => navigate('/account/update-address')}>
                                Change
                            </Button>
                        </Box>
                        <Typography variant="body2" color="grey">
                            {Object.entries(user.address).map(([key, value]) => (
                                <span key={key}>{toTitleCase(value)} </span>
                            ))}
                        </Typography>
                    </SectionWrapper>
                </Box>
                
                <Box sx={{display: {md: 'flex'}}}>
                    <SectionWrapper>
                        <Box sx={{display: {xs: 'flex', md: 'none'}, width: 100, justifyContent: 'center', position: selectedIds.length && 'sticky', top: 70, backdropFilter: 'blur(10px)', WebkitBackdropFilter: "blur(10px)", zIndex: 1000, p: 2, py: 1, borderRadius: '0px 5px 5px 0px'}}>
                            <Typography variant="body2" color="secondary" fontWeight='bold'>
                                {selectedIds.length} selected
                            </Typography>
                        </Box>
                        <Box  sx={{ width: {md: '60%'},}}>
                            {/* Desktop On*/}
                            <Box sx={{ display: {xs: 'none', md: "flex"}, justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="Subtitle1" fontWeight='bold'>
                                    Shopping Cart ({validCartItems.length})
                                </Typography>
                                <Box sx={{display: 'flex', gap: 2}}>
                                    {selectedIds.length > 0 && (
                                        <Button variant="text" color="error" onClick={handleRemoveSelected}>
                                            <DeleteRounded fontSize="small" sx={{mr: 1}}/> Delete Selected
                                        </Button>
                                    )}
                                    <Button variant={selectedIds.length === validCartItems.length ? 'contained' : 'text'} color="secondary" onClick={handleSelectAll}>
                                        {selectedIds.length === validCartItems.length ? <><RemoveDoneRounded fontSize="small" sx={{mr: 1}}/> Unselect All</> : <><DoneAllRounded fontSize="small" sx={{mr: 1}}/> Select All</>}
                                    </Button>
                                </Box>
                            </Box>
                            <Stack gap={2} sx={{overflowY: 'auto', height: {md: '79vh'}}}>
                                {validCartItems.slice().reverse().map((item) => {
                                    const product = item.productId;
                                    return (
                                        <Box key={item._id} >
                                            <Grid container sx={{ boxShadow: 4, borderRadius: 2, overflow: 'hidden', bgcolor: 'white'}}>
                                                <Grid size={{xs: 5}}>
                                                    <Button
                                                        onClick={() => navigate(`/product/${product._id}`)}
                                                        sx={{ padding: 0 }}
                                                    >
                                                        <Box>
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.productName}
                                                                style={{ width: "100%", display: 'block', height: '100%', aspectRatio: '1/1', objectFit: "cover" }}
                                                            />
                                                        </Box>
                                                    </Button>
                                                </Grid>
                                                <Grid size={{ xs: 7 }}>
                                                    <Stack sx={{position: 'relative', height: '100%'}}>
                                                        <Box sx={{position:'absolute', top: 0, right: 0}}>
                                                            <Checkbox
                                                                color="secondary"
                                                                checked={selectedIds.includes(product._id)}
                                                                onChange={() => toggleSelect(product._id)}
                                                            />
                                                        </Box>
                                                        <Stack sx={{ justifyContent: {xs: 'flex', md: 'space-between'}, my: {xs: 2, md: 2}, pt: {xs: 0, sm: 2}, mx: {xs: 1.5, sm: 2}, height: '100%', flexDirection: "column"}}>
                                                            <Box sx={{mb: {xs: 2, md: 0}}}>
                                                                <Typography 
                                                                    sx={{
                                                                        typography: {xs: 'subtitle2', sm: 'h6'}, 
                                                                        textWrap: {xs: 'nowrap', sm: 'none'}, 
                                                                        minWidth: 50,
                                                                        maxWidth: 200,
                                                                        scrollbarWidth: 'none', 
                                                                        overflowX: 'auto', 
                                                                    }}
                                                                >
                                                                        {product.productName ?? "Product not found"}
                                                                </Typography>
                                                                <Typography noWrap sx={{typography: {xs: 'body2'}, width: 'fit-content', border: '1px solid black', borderRadius: '999px', px: 1}}>{product.category?.name}</Typography>
                                                            </Box>
                                                            <Typography variant="body2" color="grey" sx={{display: {xs: 'none', sm: 'block'}}}>{product.description}</Typography>
                                                            <Box sx={{border: '1px solid #37353E', display: 'flex', mt: {xs: 'auto', md: 0}, justifyContent: 'center', p: {xs: .5, md: 1}, px: {xs: 1, md: 2}, mx: {xs: 0, md: 2} , borderRadius: '999px'}}>
                                                                <Typography variant="body2" color="initial" >
                                                                    PHP {(product.price ?? 0).toLocaleString('en-PH', {minimumFractionDigits: 2})}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </SectionWrapper>
                    
                    {/* Right Container */}
                    <Box sx={{display: {xs: 'none', md: 'flex'}, flexDirection: 'column', width: {xs: 0, md: '40%'}, height: 400, p: 2}}>
                        <Typography variant="subtitle1" fontWeight='bold' color="secondary" sx={{mb: 1}}>
                            Order Summary
                        </Typography>
                        <Box sx={{boxShadow: 2, p: 2, borderRadius: 2, mb: 2}}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                <Typography variant="subtitle2" color="initial" fontWeight='bold'>
                                    Shipping Address:
                                </Typography>
                                <Button variant="outlined" color="secondary">
                                    Change
                                </Button>
                            </Box>
                            <Typography variant="body2" color="grey">
                                {Object.entries(user.address).map(([key, value]) => (
                                    <span key={key}>{toTitleCase(value)} </span>
                                ))}
                            </Typography>
                        </Box>
                        <Box sx={{boxShadow: 2, p: 2, borderRadius: 2}}>
                            <Typography variant="body1" color="initial" fontWeight='bold'>
                                Selected Item:
                            </Typography>
                            <Box sx={{my: 1}}>
                                {selectedItemsDetails.map((item, index) => (
                                    <Grow in={true}  key={index} mountOnEnter unmountOnExit timeout={500}>
                                        <List sx={{py: 0}}>
                                            <ListItem sx={{display: 'flex', px: 0, justifyContent: 'space-between', py: 1, my: 0}}>
                                                <Typography noWrap variant="subtitle2" color="initial">
                                                    - {item.name}
                                                </Typography>
                                                <Typography variant="subtitle2" color="grey">
                                                    PHP {formatNumber(item.price)}
                                                </Typography>
                                            </ListItem>
                                        </List>
                                    </Grow>
                                ))}
                            </Box>
                            <Divider/>
                            <Box sx={{my: 2, display: 'flex', justifyContent: 'space-between'}}> 
                                <Typography variant="subtitle2" fontWeight='bold'>
                                    Sub-total (
                                        {selectedIds.length ?
                                            (
                                                `${selectedIds.length} item${selectedIds.length <= 1 ? '' : 's'}`
                                            )
                                            :
                                            ''
                                        }
                                    ) :
                                </Typography>
                                <Typography variant="subtitle2">
                                    PHP {formatNumber(totalPrice)} 
                                </Typography>
                            </Box>
                            <Box sx={{width: '100%'}}>
                                {selectedIds.length > 0 && (
                                    <Button variant="contained" color="secondary" fullWidth onClick={handleCheckout}>
                                        Checkout Selected
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Stack>
            
            <Box sx={{ display: {xs: "flex", md: 'none'}, }}>
                <BottomActionBar>
                    <Box>
                        <Box sx={{display: 'flex', mb: summaryOpen ? 1 : 0, alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="body2" fontWeight='bold'>
                                Order Summary:
                            </Typography>
                            <IconButton onClick={() => setSummaryOpen(!summaryOpen)}>
                                {summaryOpen ? <KeyboardArrowUpRounded/> : <KeyboardArrowDownRounded/>}
                            </IconButton>
                        </Box>
                        <Collapse in={summaryOpen}>
                            {selectedIds.length ? 
                                <Box sx={{ justifyContent: "space-between", p: 1,  mb: 1, overflowY: 'auto', bgcolor: '#f8f8f8', borderRadius: 2, maxHeight: 100}}>
                                    {selectedItemsDetails.map((item, index) => (
                                        <List sx={{py: 0}} key={index}>
                                            <ListItem sx={{display: 'flex', px: 0, justifyContent: 'space-between', py: 2, my: 0}}>
                                                <Typography noWrap variant="subtitle2" color="initial">
                                                    - {item.name}
                                                </Typography>
                                                <Typography variant="subtitle2" color="grey">
                                                    PHP {formatNumber(item.price)}
                                                </Typography>
                                            </ListItem>
                                            <Divider/>
                                        </List>
                                    ))}
                                </Box>
                                :
                                <Typography variant="subtitle2" sx={{justifySelf: 'center'}}>
                                    - No Items Selected -
                                </Typography>    
                            }
                        </Collapse>
                         <Box sx={{my: 1, display: 'flex', justifyContent: 'space-between'}}> 
                            <Typography variant="subtitle2" fontWeight='bold'>
                                Sub-total:
                            </Typography>
                            <Typography variant="subtitle2">
                                PHP {totalPrice.toLocaleString('en-PH', {minimumFractionDigits: 2})} 
                            </Typography>
                        </Box>
                    </Box>
                    {selectedIds.length > 0 && (
                        <Button variant="contained" color="secondary" onClick={handleCheckout}>
                            Checkout Selected
                        </Button>
                    )}
                </BottomActionBar>
            </Box>
        </Container>
    );
}
