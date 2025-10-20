import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, CopyCheckIcon, CopyIcon, Divide, LocationEditIcon, MapPinIcon } from 'lucide-react'
import { Box, Drawer, Stack, Container, Typography, Tooltip, IconButton, Collapse, Divider, Button, Grid } from '@mui/material'
import OrderStatusStepper from './OrderStatusStepper'
import SectionWrapper from '../../../components/SectionWrapper'
import dayjs from 'dayjs'
import { formatNumber, toTitleCase } from '../../../utils/stringUtils'
import { useNavigate } from 'react-router-dom'

const OrderDetailsDrawer = ({order, open, onClose}) => {
    const [copied, setCopied] = useState(false)
    const [viewMore, setViewMore] = useState(false)
    const [infoMore, setInfoMore] = useState(false)
    const navigate = useNavigate()

    const address = order.userId?.address
    const fullAddress = `${address?.street}, ${address?.city}, ${address?.province}, ${address?.region}, ${address?.postalCode}`
    const totalAmount = order.products.reduce(
        (acc, product) => acc + product.productId.price,
        0
    );
    return (
        <Box>
            <Drawer anchor="bottom" open={open} onClose={onClose} sx={{ position: 'relative', width: "100%", display: {xs: 'block', md: 'none'}, }} PaperProps={{sx: {height: '90vh'}}}>
                <Stack >
                    <Container sx={{bgcolor: '#f0f0f0ff', height: '100%', py: 3}}>
                        <Stack gap={2}>
                            <Typography variant="body1" color="initial">
                                Order Details
                            </Typography>
                            <SectionWrapper>
                                <Typography variant="body1" color="initial" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <MapPinIcon/> Delivery Information
                                </Typography>
                                <Stack sx={{p: 1}} gap={.5}>
                                    <Stack>
                                        <Typography variant="body2" color="secondary">
                                            {order.userId?.fullName}
                                        </Typography>
                                        <Typography variant="body2" color="gray">                                         
                                            {toTitleCase(fullAddress)}
                                        </Typography>
                                    </Stack>
                                    <Divider/>
                                    <Collapse in={infoMore}>
                                        <Typography variant="body2" color="secondary">{order.userId?.fullName}</Typography>
                                        <Typography variant="body2" color="secondary">{order.userId?.isLocal === true ? 'Local' : 'International'} user</Typography>
                                        <Typography variant="body2" color="secondary">{order.userId?.number || 'XXXXXXXXXXX'}</Typography>
                                        <Typography variant="body2" color="secondary">{order.userId?.email}</Typography>
                                    </Collapse>
                                    <Button variant='text'  color='secondary' fullWidth sx={{p: 0}} onClick={() => setInfoMore((prev) => !prev)}>  
                                        {infoMore === true ? 'Less' : 'More' }
                                        {infoMore === true ? <ChevronUpIcon/> : <ChevronDownIcon/> }
                                    </Button>
                                </Stack>
                            </SectionWrapper>
                            <SectionWrapper>
                                <Typography variant="body1" color="initial">
                                    Purchase Status: 
                                </Typography>
                                <OrderStatusStepper orderStatus={order.purchaseStatus}/>
                            </SectionWrapper>
                            <SectionWrapper>
                                <Typography variant="body1" color="initial" gutterBottom>{ order.products.length > 1 ? 'Products' : 'Product' }</Typography>
                                <Stack gap={2}>
                                    {order.products.map((product) =>
                                        <Stack direction={'row'}justifyContent={'space-between'} gap={5} key={product._id}>
                                            <Stack sx={{width: '20%'}}>
                                                <Box sx={{width: 100, height: 100}}>
                                                    <img 
                                                        src={product.productId?.images?.[0]} 
                                                        alt={product.productId?.productName} 
                                                        style={{
                                                            display: 'block',
                                                            aspectRatio: '1/1',
                                                            borderRadius: '5px',
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                            height: '100%',
                                                        }}
                                                    />
                                                </Box>
                                            </Stack>
                                            <Stack width={'80%'} justifyContent={'space-evenly'}>
                                                <Typography variant="body2" fontWeight={'bold'} gutterBottom color="secondary">
                                                    {product.productId?.productName}
                                                </Typography>
                                                <Typography variant="body2" color="secondary">
                                                    {product.productId?.isLocal === true ? 'Small' : 'Large'} item
                                                </Typography>
                                                <Stack direction={'row'}>
                                                    <Typography variant="body2" color="secondary" sx={{border: '1px solid gray', borderRadius: '999px', px: 1}}>
                                                        {toTitleCase(product.productId?.category?.name)}
                                                    </Typography>
                                                    <Divider orientation='vertical' sx={{mx: 1}}/>
                                                    <Typography variant="body2" color="secondary" sx={{border: '1px solid gray', borderRadius: '999px', px: 1}}>
                                                        {toTitleCase(product.productId?.condition)}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="body2" color="secondary" sx={{alignSelf: 'flex-end'}}>
                                                    PHP {formatNumber(product.productId?.price)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    )}
                                    <Divider/>
                                    <Stack justifyContent={'space-between'} direction={'row'}>
                                        <Typography variant="body1" color="secondary">Order total</Typography>
                                        <Typography variant="body1" color="secondary">PHP {formatNumber(totalAmount)}</Typography>
                                    </Stack>
                                </Stack>
                            </SectionWrapper>
                            <SectionWrapper sx={{gap: 1}}>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography variant="body2" color="initial">
                                        Order ID
                                    </Typography>
                                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                                        <Typography variant="body2" color="initial">
                                            {order.orderId}
                                        </Typography>
                                        <Tooltip title='Copy Order ID'>
                                            <IconButton 
                                                size='small' 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(order.orderId || '');
                                                    setCopied(true);
                                                    setTimeout(() => {
                                                        setCopied(false)
                                                    }, 2000);
                                                }}
                                            >
                                                {copied ? <CopyCheckIcon style={{color: 'green'}}/> : <CopyIcon/>}
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography variant="body2" color="secondary">Paid by</Typography>
                                    <Typography variant="body2" color="secondary">{order.paymentMethod === 'gcash' ? 'GCash' : order.paymentMethod}</Typography>
                                </Stack>
                                <Divider/>
                                <Collapse in={viewMore} unmountOnExit mountOnEnter>
                                    <Stack gap={.5}>
                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                            <Typography variant="body2" color="secondary">Order Time</Typography>
                                            <Typography variant="body2" color="secondary">{dayjs(order.createdAt).format('MMMM D, YYYY - h:mm A')}</Typography>
                                        </Stack>
                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                            <Typography variant="body2" color="secondary">Transaction Ref</Typography>
                                            <Typography variant="body2" color="secondary">{order.transactionReference}</Typography>
                                        </Stack>
                                    </Stack>
                                </Collapse>
                                <Button variant='text' color='secondary' onClick={() => setViewMore((prev) => !prev)}>
                                    {!viewMore ?  'View more' : 'View Less'}
                                    {!viewMore ? <ChevronDownIcon/> : <ChevronUpIcon/>}
                                </Button>
                            </SectionWrapper>
                            <Stack>
                                <Button variant='contained' fullWidth color='secondary' onClick={() => navigate('/shop')}>
                                    View Shop
                                </Button>
                            </Stack>
                        </Stack>
                    </Container>
                </Stack>
            </Drawer>
        </Box>
    )
}

export default OrderDetailsDrawer
