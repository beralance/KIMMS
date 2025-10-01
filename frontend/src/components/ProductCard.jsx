import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Badge, Box, Stack } from '@mui/material';
import {toTitleCase} from '../utils/stringUtils'
import { ShoppingCartRounded } from '@mui/icons-material';

export default function ProductCard({ images, category, name = 'Unknown', price = 0, description = '...', onNavigate, addToCart, condition}) {
    return (
        <Card
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                borderRadius: 5,
                boxShadow: 5,
            }}
        >

            {/* Clickable area for navigation */}
            <Box onClick={onNavigate} sx={{ cursor: 'pointer', p: 1}}>
                {/* Product Image */}
                <Box sx={{position: 'relative'}}>
                    <CardMedia
                        component="img"
                        image={images}
                        alt={name}
                        sx={{
                            aspectRatio: '9/12',
                            objectFit: 'cover',
                            borderRadius: 3
                    }}
                    />
                    <Box sx={{position: 'absolute', top: 15, left: 0, bgcolor: '#37353E', p: .5, px: 2, borderRadius: '0px 5px 5px 0px'}}>
                        <Typography variant="body2" color="white">
                            {toTitleCase(condition)}
                        </Typography>
                    </Box>
                    
                </Box>

                {/* Card Body */}
                <CardContent sx={{px: .5, mb: 1, '&:last-child': {paddingBlock: 1}}}>
                    {/* Product Name */}
                    <Typography
                        variant="body1"
                        component="div"
                        noWrap
                        sx={{ fontWeight: 600, mb: 1 }}
                    >
                        {name}
                    </Typography>
                    
                    <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'space-between'} sx={{mb: 1}}>
                        <Typography
                            variant="body2"
                            color='white'
                            sx={{py: .5, px: 2, width: '100%', bgcolor: '#37353E', display: 'flex', justifyContent: 'center', borderRadius: '999px', fontWeight: 'bold',}}
                        >
                            PHP {price.toLocaleString()}
                        </Typography>
                        
                    </Stack>
                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            display: '-webkit-box',
                            height: 20,
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Box>

            {/* Add to Cart Button (separate from navigation click) */}
            {/* Price */}
            <Stack direction={'row'} gap={1}>
                {/* Category */}
                <Typography
                    variant="body2"
                    fontWeight={'bold'}
                    sx={{ width: '100%', px: 1,py: .5, color: 'black', backdropFilter: 'blur(10px)', bgcolor: 'rgba(255, 255, 255, 255)', borderRadius: '999px'}}
                >
                    {category}
                </Typography>
                <CardActions sx={{ p: 0, pt: 0 }}>
                    <Button
                        variant="contained"
                        size="medium"
                        fullWidth
                        color='secondary'
                        onClick={addToCart}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 3,
                        }}
                    >
                        <ShoppingCartRounded/>
                    </Button>
                </CardActions>
            </Stack>
        </Card>
    );
}
