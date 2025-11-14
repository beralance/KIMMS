import React, { useEffect } from 'react';
import { Container, Typography, Button, Box, Stack, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';

export default function Success() {
    const navigate = useNavigate();

    return (
        <Container>
            <Stack justifyContent={'center'} alignItems={'center'}  sx={{pb: 20, height: '100vh'}}>
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
                    <Typography variant='body2' sx={{ mb: 3 }} align='center'>
                        Thank you for your purchase.
                    </Typography>
                </Stack>
                <Button variant="outlined" color='secondary' sx={{borderRadius: '999px', px: 3}} onClick={() => navigate('/my-purchases')}>
                    View my purchase
                </Button>
            </Stack>
        </Container>
    );
}
