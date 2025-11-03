
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
                    borderRadius: 1, 
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
                <Box>
                    <Stack alignItems={'center'} gap={2}>
                        <Stack sx={{alignItems: 'center'}}>
                            <Stack alignItems={'center'} width={'80%'}>
                                <Typography variant="body1" align='center' color='secondary' noWrap sx={{fontWeight: 'bold', textOverflow: 'ellipsis'}}>
                                    {product.productName}
                                </Typography>
                            </Stack>
                            <Typography variant='body2' align='center' color='secondary' maxHeight={40} overflow={'hidden'} sx={{textOverflow: 'ellipsis'}}>
                                {product.description}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Button variant='contained' color='secondary' onClick={onNavigate} sx={{alignSelf: 'flex-end', py: .5, borderRadius: '999px', px: 4}}>
                                Visit
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Card>
        </SectionTransition>
    );
}
