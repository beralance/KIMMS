import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Stack, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react'
import {getPaymentStatus} from '../../../utils/paymentApi'
import {formatNumber} from '../../../utils/stringUtils'
import SectionWrapper from '../../../components/SectionWrapper'
import dayjs from 'dayjs'


export default function Success() {
    const [payment, setPayment] = useState(null)
    const [totalAmount, setTotalAmount] = useState(0)
    
    const navigate = useNavigate();
    const orderId = new URLSearchParams(window.location.search).get("orderId");

    useEffect(() => {
        const fetchPayment = async () => {
            const paym = await getPaymentStatus(orderId)
            console.log('ASDFASDFASDF', paym)
            setPayment(paym)
            const amount = (paym.amount / 100)
            setTotalAmount(formatNumber(amount))
        }
        fetchPayment()
    }, [orderId])

    return (
        <Container>
            <Stack justifyContent={'center'} alignItems={'center'} gap={2} py={4} sx={{height: '100%'}}>
                <Box>
                    <img 
                        src={'/box-celebration-gift.svg'}
                        style={{
                            display: 'block',
                            width: '150px',
                            height: '150px',
                        }}
                    />
                    <Button 
                        variant='contained'
                        color='secondary'
                        onClick={() => navigate('/shop')}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            borderRadius: '999px',
                            left: 10,
                        }}
                    >
                        <ChevronLeftIcon style={{color: 'white'}}/>
                    </Button>
                </Box>
                <Stack>
                    <Typography variant="h4" align='center'>
                        Payment Successful!
                    </Typography>
                    <Typography variant='body2' align='center'>
                        Thank you for your purchase.
                    </Typography>
                </Stack>
                
                <SectionWrapper sx={{bgcolor: '#f4f4f4', width: 450}}>
                    {payment?.productIds?.map((product, index) => 
                        <Box key={index} width={'100%'} height={450}>
                            <img src={product?.images[0]} style={{display: 'block', borderRadius: '3px', width: '100%', height: '100%', objectFit: 'cover'}} />
                        </Box>
                    )}
                    <Divider sx={{my: 2}}>
                        <Typography variant='body2' color='gray'>
                            Transaction Summary
                        </Typography>
                    </Divider>
                    <Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant='body2' color='secondary'>Transaction Ref.</Typography>
                            <Typography variant='body2' color='gray'> {payment?.orderId?.transactionReference}</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant='body2' color='secondary'>Session ID</Typography>
                            <Typography variant='body2' color='gray'>{payment?.checkoutSessionId}</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant='body2' color='secondary'>Amount</Typography>
                            <Typography variant='body2' color='gray'>Php {formatNumber(totalAmount)}</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant='body2' color='secondary'>Order ID</Typography>
                            <Typography variant='body2' color='gray'> {payment?.orderId?.orderId}</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant='body2' color='secondary'>Total Products</Typography>
                            <Typography variant='body2' color='gray'> {payment?.productIds.length}</Typography>
                        </Stack>
                        {payment?.productIds?.map((product, index) => 
                            <Stack direction={'row'} justifyContent={'space-between'} key={index}>
                                <Typography variant='body2' color='secondary'>Products</Typography>
                                <Typography variant='body2' color='gray'> {product?.productName}</Typography>
                            </Stack>
                        )}
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant='body2' color='secondary'>Paid At</Typography>
                            <Typography variant='body2' color='gray'>{dayjs(payment?.paidAt).format("MMMM DD YYYY | h:mm A")}</Typography>
                        </Stack>
                    </Stack>
                </SectionWrapper>
                <Button variant="outlined" color='secondary' sx={{borderRadius: '999px', px: 3, my: 2}} onClick={() => navigate('/my-purchases')}>
                    View my purchase
                </Button>
            </Stack>
        </Container>
    );
}
