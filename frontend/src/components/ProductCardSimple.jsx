
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { Box, Button, Grid, CardActions, IconButton, Stack, } from '@mui/material';
import { toTitleCase, formatNumber } from '../utils/stringUtils'
import SectionTransition from './SectionTransition'
import { useNavigate } from 'react-router-dom';
import { ArrowRightRounded } from '@mui/icons-material';

export default function ProductCardSimple ({ product, onNavigate, addToCart }) { 
    const navigate = useNavigate()

    return (
        <SectionTransition>
            <Card 
                sx={{
                    p: 2, 
                    m: 1, 
                    boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)', 
                    borderRadius: 2, 
                    minWidth: 100, 
                    maxWidth: 300,
                    
                }}
            >
                
                <Box sx={{position: 'relative'}}>
                    <img 
                        src={product.images[0]}
                        alt={product.productName} 
                        style={{
                            aspectRatio: '9/10',
                            width: '100%',
                            borderRadius: 2,
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer'
                        }}
                    />
                </Box>
                <CardContent sx={{py: '0px !important'}}>
                    <Stack alignItems={'center'} sx={{px: .5}}>
                        <Stack sx={{alignItems: 'center', py: 1}}>
                            <Stack alignItems={'center'} width={'100%'} sx={{mb: .5}}>
                                <Typography variant="body1" align='center' color='secondary' noWrap sx={{width: '80%', fontWeight: 'bold'}}>
                                    {product.productName}
                                </Typography>
                            </Stack>
                            <Typography variant='body2' align='center' color='secondary' height={40} overflow={'auto'}>
                                {product.description}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Button variant='contained' color='secondary' onClick={onNavigate} sx={{alignSelf: 'flex-end', py: .5, my: 1, borderRadius: '999px', px: 4}}>
                                Visit
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
                
            </Card>
        </SectionTransition>
    );
}
