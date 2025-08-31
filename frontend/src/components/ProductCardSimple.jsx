
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { Box, Button, CardActions, IconButton } from '@mui/material';

export default function ProductCardSimple ({ product, onNavigate, addToCart }) { 
    return (
        <Card sx={{ boxShadow: 'none', borderRadius: 0 }}>
            <CardMedia
                sx={{ minHeight: 100, maxHeight: 500, height: '100%', aspectRatio: '9/10', borderRadius: 3 }}
                image={product.image}
                title={product.name}
            />
            <CardContent sx={{ flexGrow: 1, px: .5, py: 2 }}>
                <Typography variant="h5" noWrap sx={{ fontWeight: 600, mb: 1 }}>
                    {product.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 500 }}>
                    <span style={{fontWeight: 'bold'}}>PHP</span> {product.price.toLocaleString()}
                </Typography>
            </CardContent>
            <CardActions sx={{p: 0,  mb: 4}}>
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <Button onClick={onNavigate} variant='contained' color='secondary' sx={{width: '100%', fontSize: 15, fontWeight: 'bold'}}>
                        Visit Product
                    </Button>
                    <IconButton onClick={addToCart} sx={{p: 0,}}>
                        <ShoppingCartRoundedIcon sx={{ml: 3, fontSize: 30}}/>
                    </IconButton>
                </Box>
            </CardActions>
        </Card>
    );
}
