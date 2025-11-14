import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { formatNumber } from '../../../utils/stringUtils'
import { useNavigate } from 'react-router-dom'
import { StoreIcon } from 'lucide-react'

const MostViewedProducs = ({products}) => {
    const navigate = useNavigate()
    
    return (
        <Stack gap={5}>
            <Grid container spacing={2}>
                {products.map((p) => 
                    <Grid key={p._id} size={{xs: 6}}>
                        <Box sx={{cursor: 'pointer'}} onClick={() => navigate(`/product/${p._id}`)}>
                            <img 
                                src={p.images[0]} 
                                style={{
                                    display: 'block',
                                    objectFit: 'cover',
                                    height: '100%',
                                    width: '100%',
                                    aspectRatio: '9/12',
                                    borderRadius: '5px'
                                }}
                            />
                        </Box>
                        <Stack gap={1} p={.5}>
                            <Stack>
                                <Typography variant="subtitle2" color="initial" noWrap>
                                    {p.productName}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    Php {formatNumber(p.price)}
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} gap={1}>
                                <Typography variant="body2" color="gray" sx={{borderRadius: '999px', border: '1px solid gray', px: 1}}>
                                    {p.category?.name}
                                </Typography>
                                <Divider orientation='vertical' flexItem/>
                                <Typography variant="body2" color="gray" sx={{borderRadius: '999px', border: '1px solid gray', px: 1}}>
                                    {p.condition}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                )}
            </Grid>
            <Button variant='contained' color='secondary' onClick={() => navigate('/shop')} sx={{my: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1}}>
                <StoreIcon style={{color: 'white'}}/>
                View More in Shop
            </Button>
        </Stack>
    )
}

export default MostViewedProducs
