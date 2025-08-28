import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function ProductCardSimple ({image, name='Unknown', price = 0, description='...' }) {
    return (
        <Card sx={{boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4)'}}>
            <CardMedia
                sx={{ minHeight: 100, maxHeight: 500, height: '100%', aspectRatio: '9/10'}}
                image={image}
                title={name}
            />
            <CardContent sx={{p: 1}}>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body1" gutterBottom component="div">
                    PHP {price}
                </Typography>
                <CardActions sx={{p: 0, my: 1, display: 'flex', justifyContent: 'center'}}>
                    <Button variant='contained' size="small" sx={{flexGrow: 2, p: '2'}}>Checkout</Button>
                    <Button variant='contained' size="small" sx={{flexGrow: 1, p: '2'}}>Visit</Button>
                </CardActions>
            </CardContent>
            
        </Card>
    );
}
