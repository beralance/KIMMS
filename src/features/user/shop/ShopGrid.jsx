import React, { useState } from 'react'
import { Box, Container, Grid } from '@mui/material'
import ProductCard from '../../../components/ProductCard'
import products from '../../../data/products'

const ShopGrid = ({products}) => {
    
    return (
        <Container>
            <Grid container rowSpacing={{xs: 3, sm: 6,}} columnSpacing={{xs: 1, sm: 4, md: 3}} sx={{display: 'flex', justifyContent: 'center'}}>
                {products.map((product) => (
                    <Grid key={product.id} size={{xs: 12, sm: 6, md: 4}}>
                        <ProductCard 
                            name={product.name}
                            price={product.price}
                            description={product.description}
                            image={product.image}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default ShopGrid
