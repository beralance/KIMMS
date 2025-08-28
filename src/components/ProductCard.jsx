import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function ProductCard({ image, name = 'Unknown', price = 0, description = '...' }) {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        image={image}
        alt={name}
        sx={{
          aspectRatio: '1/1',
          objectFit: 'cover',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* Card Body */}
      <CardContent sx={{ flexGrow: 1 }}>
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
          sx={{ color: 'primary.main', fontWeight: 500, mb: 1 }}
        >
          ₱{price.toLocaleString()}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 2, // show 2 lines max
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
      </CardContent>

      {/* Add to Cart Button */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          size="medium"
          fullWidth
          sx={{
            borderRadius: '999px',
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
