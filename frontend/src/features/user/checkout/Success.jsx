import React, { useEffect } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
                </Box>
                <Stack>
                    <Typography variant="h4" align='center'>
                        Payment Successful!
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 3 }} align='center'>
                        Thank you for your purchase.
                    </Typography>
                </Stack>
                <Button variant="contained" color='secondary' sx={{borderRadius: '999px', px: 3}} onClick={() => navigate('/shop')}>
                    Back to Shop
                </Button>
            </Stack>
        </Container>
    );
}
