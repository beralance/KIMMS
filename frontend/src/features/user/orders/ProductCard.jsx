import React from 'react'
import {} from 'lucide-react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { formatNumber, toTitleCase } from '../../../utils/stringUtils'
import { useNavigate } from 'react-router-dom'


const ProductCard = ({product}) => {
    const navigate = useNavigate()
    return (
        <Box>
            <Stack>
                <Stack direction={'row'} overflow={'hidden'}>
                    <Stack width={'40%'}>
                        <Box sx={{height: 150, width: 150}}>
                            <img 
                                src={product.productId?.images?.[0] || '/placeholder-image.svg'} 
                                alt={product.productId?.productName} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    aspectRatio: '1/1',
                                    display: 'block',
                                    borderRadius: '5px'
                                }}
                            />
                        </Box>
                    </Stack>
                    <Stack sx={{width: '60%'}}>
                        <Typography variant="body1" color="secondary" noWrap sx={{textOverflow: 'ellipsis'}}>{product.productId?.productName}</Typography>
                        <Typography variant="body2" color="secondary">PHP {formatNumber(product.productId?.price)}</Typography>
                        <Divider sx={{my: 1}}/>
                        <Stack direction={'row'}>
                            <Typography variant="body2" color="secondary" noWrap sx={{textOverflow: 'ellipsis', px: 1, border: '1px solid gray', borderRadius: '999px'}}>{product.productId?.category?.name}</Typography>
                            <Divider orientation='vertical' sx={{mx: 1}}/>
                            <Typography variant="body2" color="secondary" noWrap sx={{textOverflow: 'ellipsis', px: 1, border: '1px solid gray', borderRadius: '999px'}}>{product.productId?.condition}</Typography>
                        </Stack>
                        <Typography variant="body2" color="secondary" noWrap sx={{textOverflow: 'ellipsis'}}>{product.productId?.isLocal === true ? 'Small' : 'Large'} item</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}

export default ProductCard
