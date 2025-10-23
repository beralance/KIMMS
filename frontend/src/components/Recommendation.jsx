import React, { useContext } from 'react'
import { Stack, Box, Typography } from '@mui/material'
import {ProductContext} from '../contexts/ProductContext'
import { useNavigate } from 'react-router-dom'

const Recommendation = () => {
    const navigate = useNavigate()
    const {products} = useContext(ProductContext)
    
    const recomProduct = products.filter(product => product.highlight === 'featured')

    return (
        <Box>
            <Stack gap={2}>
                <Stack>
                    <Typography variant="body1" color="initial">Recommendation</Typography>
                </Stack>
                <Stack direction="row" gap={2} sx={{overflowY: 'auto', width: '100%'}}>
                    {recomProduct.map(product => 
                        <Stack key={product._id} alignItems="center" gap={2}>
                            <Box onClick={() => navigate(`/product/${product._id}`)} sx={{ cursor: 'pointer', width: 150, overflow: 'hidden', borderRadius: 1 }}>
                                <img
                                    src={product.images?.[0]}
                                    alt={product.productName}
                                    style={{
                                        display: 'block',
                                        aspectRatio: '9/10',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <Stack>
                                <Typography variant="body2" textAlign={'center'} gutterBottom>{product.productName}</Typography>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Box>
    )       
}

export default Recommendation
