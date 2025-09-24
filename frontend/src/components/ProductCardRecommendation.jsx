
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { Box, Button, CardActions, IconButton } from '@mui/material';
import { UPLOADS_URL } from '../utils/constants';

export default function ProductCartRecommendation ({ product, onNavigate }) { 
    return (
        <Card sx={{ boxShadow: 'none', width: 200, borderRadius: 2}}>
            <CardMedia
                onClick={onNavigate}
                sx={{ minHeight: 100, maxHeight: 500, height: '100%', aspectRatio: '9/10'}}
                image={`${UPLOADS_URL}${product.image}`}
                title={product.name}
            />
            <CardContent sx={{ flexGrow: 1, px: 1, py: 2 }}>
                <Typography noWrap sx={{ fontWeight: 'bold', fontSize: {xs: 18, md: 25, xl: 30, }, mb: 1 }}>
                    {product.productName}
                </Typography>
                <Typography sx={{ color: 'secondary.main', fontSize: {xs: 15, md: 22, xl: 27, }, }}>
                    <span style={{fontWeight: 'bold'}}>PHP</span> {product.price.toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    );
}
