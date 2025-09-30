import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { UPLOADS_URL } from '../utils/constants';
import { Button, Popover, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function TitlebarImageList({products}) {
    const navigate = useNavigate()

    return (
        <ImageList sx={{ width: 'auto', height: 450, bgcolor: '#f0f0f0', p: 1, borderRadius: 2 }}>
            {products.map((item) => (
                <ImageListItem key={item._id} sx={{borderRadius: 1}}>
                    <img
                        srcSet={`${UPLOADS_URL}${item.images[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${UPLOADS_URL}${item.images[0]}?w=248&fit=crop&auto=format`}
                        alt={item.productName}
                        loading="lazy"
                        style={{aspectRatio: '1/1'}}
                    />
                    <Box onClick={() => navigate(`/product/${item._id}`)} sx={{p: 0}}>
                        <ImageListItemBar
                            title={item.productName}
                            subtitle={item.category?.name}
                        />
                    </Box>
                </ImageListItem>
            ))}
        </ImageList>
    );
}