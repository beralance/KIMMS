import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { fetchCategoriesFromProducts } from '../../../utils/categoryApi'
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography'
import { Box, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {ScrollSectionLeft, ScrollSectionRight} from '../../../components/SectionTransitionX';

export default function CategoriesList() {
    const [categories, setCategories] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetchCategoriesFromProducts()   // your existing API call
            .then(data => {
                console.log("Fetched categories:", data);
                setCategories(data);

                // sort descending by count
                const sorted = [...data].sort((a, b) => b.count - a.count);

                // get highest and second highest
                setTopCategories(sorted.slice(0, 2));
            })
    .catch(err => console.error(err));
    }, []);

    return (
        <Box sx={{p: 2, mb: 12, borderRadius: 2, maxHeight: {xs: 300}, overflowY: 'auto',}}>
            <Grid spacing={1} container>
                {categories.map((category) => (
                    <Grid size={{xs: 6}} key={category.categoryId} sx={{position: 'relative'}}>
                        <ScrollSectionLeft>
                            <Box onClick={() => navigate(`/shop?category=${category.categoryId}`)}>
                                <Box sx={{width: '100%', height: '100%',}}>
                                    <img 
                                        src={`${category.image[0]}`}
                                        alt={category.name}
                                        style={{
                                            display: 'block',
                                            objectFit: 'cover',
                                            width: '100%',
                                            cursor: 'pointer',
                                            aspectRatio: '1/1',
                                            height: '100%',
                                            borderRadius: '5px',
                                        }}
                                    />
                                </Box>
                                <Typography 
                                    variant="body1" 
                                    color="white"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        cursor: 'pointer',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        height: '80%',
                                        px: 2,
                                        py: 1,
                                        borderRadius: '0px 0px 5px 5px',
                                        background:
                                            'linear-gradient(to top, rgba(0,0,0,1) 0%, ' +
                                            'rgba(0,0,0,.2) 70%, rgba(0,0,0,0) 100%)',
                                        }}
                                    >
                                    {category.name}
                                </Typography>
                            </Box>
                        </ScrollSectionLeft>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
