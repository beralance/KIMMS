
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { Box, Button, CardActions, IconButton } from '@mui/material';

export default function ProductCartRecommendation ({ product, onNavigate }) { 
    return (
        <Card sx={{ boxShadow: 2, width: 200, borderRadius: 1,}}>
            <CardMedia
                onClick={onNavigate}
                sx={{ cursor: 'pointer', borderRadius: 0, minHeight: 100, maxHeight: 500, height: '100%', aspectRatio: '9/10'}}
                image={product.images[0]}
                title={product.name}
            />
            <CardContent sx={{ flexGrow: 1, px: 1, py: 2 }}>
                <Typography noWrap variant='body1'>
                    {product.productName}
                </Typography>
                <Typography variant='body2' color='secondary'>
                    <span style={{fontWeight: 'bold'}}>PHP</span> {product.price.toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    );
}
