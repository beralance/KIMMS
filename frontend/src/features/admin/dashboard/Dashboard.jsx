import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import AdminAutoSlideCarousel from '../../../components/AdminAutoSlideCarousel'


const Dashboard = () => {
    return (
        <>
            <Container>
                <AdminAutoSlideCarousel/>
                <Box>
                    <Typography variant="body1" color="initial">
                        Hello World!
                    </Typography>
                    <Button fullWidth variant='contained' color='secondary'>
                        hello world
                    </Button>
                </Box>
            </Container>
        </>
    )       
}

export default Dashboard
