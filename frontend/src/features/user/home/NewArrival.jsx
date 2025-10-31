import { ArrowCircleRightRounded, ArrowRightRounded } from '@mui/icons-material'
import { Box, Button, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import { ProductContext } from '../../../contexts/ProductContext'
import { useContext, useEffect } from 'react'
import {formatNumber, toTitleCase} from '../../../utils/stringUtils'
import { useNavigate } from 'react-router-dom'
import {ScrollSectionLeft} from '../../../components/SectionTransitionX' 

const NewArrival = () => {
    const { newProducts } = useContext(ProductContext)
    const navigate = useNavigate()        

    return (
        <Stack gap={3} sx={{maxHeight: 480, overflowY: 'auto', px: 2}}>
            {newProducts.map(product => (
                <ScrollSectionLeft key={product._id}>
                    <Grid container spacing={2}>
                            <Grid size={{xs: 6}}>
                                <img 
                                    src={`${product.images[0]}`} 
                                    alt={product.productName} 
                                    style={{
                                        width: '100%',
                                        display: 'block',
                                        height: '100%',
                                        aspectRatio: '1/1',
                                        objectFit: 'cover',
                                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                                        borderRadius: 3,
                                    }}
                                />
                            </Grid>
                            <Grid size={{xs: 6}}>
                                <Stack height={'100%'}>
                                    <Stack sx={{pb: 1}} gap={1}>
                                        <Stack>
                                            <Typography noWrap variant="body1" fontWeight={'bold'} color="secondary">
                                                {product.productName}
                                            </Typography>
                                            <Stack direction={'row'}>
                                                <Divider sx={{border: 1, color: 'black', mr: 1}}/>
                                                <Typography variant="body2" color="secondary">
                                                    PHP {formatNumber(product.price)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack direction={'row'}>
                                            <Typography variant="body2" color="secondary" noWrap >
                                                - {product.isLocal ? 'Large' : 'Small'} item -
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction={'row'} sx={{mt: 'auto'}} alignItems={'center'}>
                                        <Stack>
                                            <Typography variant="body2" color="secondary" noWrap sx={{border: 1, alignSelf: 'flex-start', py: .2, borderRadius: '999px', width: 'auto', px: 2,}}>
                                                {product.category?.name}
                                            </Typography>
                                        </Stack>
                                        <IconButton 
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            sx={{
                                                py: .5,
                                                alignSelf: 'flex-end'
                                            }} 
                                        >
                                            <ArrowCircleRightRounded fontSize='large'/>
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Grid>
                    </Grid>
                </ScrollSectionLeft>

            ))}     
        </Stack>
    )
}

export default NewArrival
