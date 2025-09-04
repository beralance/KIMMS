import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Badge, Box } from '@mui/material';

export default function ProductCard({
    image,
    name = 'Unknown',
    price = 0,
    description = '...',
    onNavigate,
    addToCart,
    condition
    }) {

    return (
        <Card
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
            }}
        >

            {/* Clickable area for navigation */}
            <Box onClick={onNavigate} sx={{ cursor: 'pointer' }}>
                {/* Product Image */}
                <Box sx={{position: 'relative'}}>
                    <CardMedia
                        component="img"
                        image={image}
                        alt={name}
                        sx={{
                            aspectRatio: '9/12',
                            objectFit: 'cover',
                            borderRadius: 3
                    }}
                    />
                    <Box sx={{position: 'absolute', top: 15, left: 10, bgcolor: '#37353E', p: .5, px: 2, borderRadius: '999px'}}>
                        <Typography variant="body1" color="white">
                            {condition}
                        </Typography>
                    </Box>
                </Box>

                {/* Card Body */}
                <CardContent sx={{px: .5, py: 2}}>
                    {/* Product Name */}
                    <Typography
                        variant="h6"
                        component="div"
                        noWrap
                        sx={{ fontWeight: 600, mb: 1 }}
                    >
                        {name}
                    </Typography>

                    {/* Price */}
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{ color: 'secondary', fontWeight: 500, mb: 1 }}
                    >
                        PHP {price.toLocaleString()}
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                        color: 'text.secondary',
                        display: '-webkit-box',
                        height: 40,
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Box>

            {/* Add to Cart Button (separate from navigation click) */}
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
                    }}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
}
