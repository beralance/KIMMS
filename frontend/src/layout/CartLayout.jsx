import React from 'react'
import CartHeader from '../components/CartHeader'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'


const CartLayout = () => {
    return (
        <Box>
            <header>
                <CartHeader/>
            </header>
            <main style={{paddingTop: '80px'}}>
                <Outlet/>
            </main>   
        </Box>
    )
}

export default CartLayout
