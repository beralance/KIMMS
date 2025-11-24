import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import SectionWrapper from '../../../components/SectionWrapper'
import { formatNumber } from '../../../utils/stringUtils'
import { useNavigate } from 'react-router-dom'

const Suggestion = ({label, subLabel, products, icon}) => {
    const navigate = useNavigate()

    
    return (
        <Stack>
            <SectionWrapper sx={{bgcolor: '#f0f0f0', gap: 2}}>
                <Stack>
                    <Typography variant="subtitle2" color="initial" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        {icon}
                        {label}
                    </Typography>
                    <Typography variant="body2" color="gray">{subLabel}</Typography>
                </Stack>
                <Stack direction={'row'} gap={2} sx={{overflowX: 'auto', pb: 1}} >
                    {products.map(product => 
                        <Stack key={product._id} width={150} gap={1}>
                            <Box width={150} height={150} sx={{cursor: 'pointer'}} onClick={() => navigate(`/product/${product._id}`)}>
                                <img 
                                    src={product?.images[0]}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '2px',
                                    }}   
                                />
                            </Box>
                            <Stack>
                                <Typography variant="body1" color="initial" align='center' noWrap>{product?.productName}</Typography>
                                <Typography variant="body2" color="secondary" align='center'>PHP {formatNumber(product?.price)}</Typography>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </SectionWrapper>
        </Stack>
    )
}

export default Suggestion
