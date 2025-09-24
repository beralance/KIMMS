
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { Box, Button, Grid, CardActions, IconButton, } from '@mui/material';
import { UPLOADS_URL } from '../utils/constants'

export default function ProductCardSimple ({ product, onNavigate, addToCart }) { 
    return (
        <Card sx={{ boxShadow: 'none', borderRadius: 0 }}>
            <CardMedia
                onClick={onNavigate}
                sx={{ minHeight: 100, maxHeight: 500, height: '100%', aspectRatio: '9/12', borderRadius: 1 }}
                image={`${UPLOADS_URL}${product.image}`}
                title={product.name} 
            />
            <CardContent sx={{ flexGrow: 1, px: .5, py: 2  }}>
                <Grid container sx={{pb: 2}}>
                    <Grid size={{xs: 9}}>
                        <Typography variant="h5" noWrap sx={{ mb: 1, fontSize: {xs: 20, md: 25, xl: 30, } }}>
                            {product.name}
                        </Typography>
                        <Typography color='grey' sx={{ fontWeight: 500, fontSize: {xs: 18, md: 25, xl: 30,}}}>
                            PHP {product.price.toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid size={{xs: 3}} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant='outlined' color='secondary' onClick={addToCart} sx={{p: 0, height: '100%', width: '100%'}}>
                            <ShoppingCartRoundedIcon color='secondary' sx={{fontSize: 30}}/>
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
