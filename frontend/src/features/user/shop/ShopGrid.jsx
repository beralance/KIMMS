import React from 'react'
import { Box, Container, } from '@mui/material'
import Grid from '@mui/material/Grid'
import ProductCard from '../../../components/ProductCard'
import { useNavigate } from 'react-router-dom'

const ShopGrid = ({ products, handleAddToCart }) => {
    const navigate = useNavigate()

    return (
        <Container sx={{ p: {xs: 2, md: 0 } }}>
            <Grid
                container
                rowSpacing={{ xs: 6, sm: 6 }}
                columnSpacing={{ xs: 1, sm: 4, md: 3 }}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                {products.map((product) => (
                    <Grid size={{xs: 12, sm: 6, md: 4}} key={product._id}>
                        <ProductCard
                            name={product.productName}
                            price={product.price}
                            description={product.description}
                            category={product.category?.name}
                            images={`${product.images[0]}`}
                            condition={product.condition}
                            onNavigate={() => navigate(`/product/${product._id}`)}
                            addToCart={() => handleAddToCart(product)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default ShopGrid
