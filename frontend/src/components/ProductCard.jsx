import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Badge, Box, Divider, Stack } from '@mui/material';
import {toTitleCase} from '../utils/stringUtils'
import { ShoppingCartRounded } from '@mui/icons-material';
import { ShoppingCartIcon } from 'lucide-react';

export default function ProductCard({ images, category, isLocal, name = 'Unknown', price = 0, description = '...', onNavigate, addToCart, condition}) {
    return (
        <Card
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                borderRadius: 2,
                boxShadow: 5,
            }}
        >

            <Box sx={{ cursor: 'pointer'}}>
                {/* Product Image */}
                <Box sx={{position: 'relative'}}>
                    <CardMedia
                        onClick={onNavigate} 
                        component="img"
                        image={images}
                        alt={name}
                        sx={{
                            aspectRatio: '9/12',
                            objectFit: 'cover',
                            borderRadius: 1
                    }}
                    />
                    <Box sx={{position: 'absolute', top: 10, right: 10, bgcolor: '#37353E', p: .5, px: 2, borderRadius: '999px'}}>
                        <Typography variant="body2" color="white">
                            {toTitleCase(condition)}
                        </Typography>
                    </Box>
                    
                </Box>

                {/* Card Body */}
                <CardContent sx={{px: .5, '&:last-child': {paddingBlock: 1}}}>
                    <Stack gap={1} justifyContent={'center'} alignItems={'space-between'}>
                        {/* Product Name */}
                        <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography
                                variant='body1'
                                component="div"
                                noWrap
                                sx={{ fontWeight: 600}}
                            >
                                {name}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color='initial'
                            >
                                PHP {price.toLocaleString()}
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} gap={1}>
                            <Typography
                                variant="body2"
                                color='black'
                                sx={{
                                    px: 1,
                                    borderRadius: '999px',
                                    border: '1px solid gray'
                                }}
                            >
                                {category}
                            </Typography>
                            <Divider orientation='horizontal' sx={{border: '0.5px solid #b3b3b3ff'}}/>
                            <Typography
                                variant="body2"
                                color='black'
                                sx={{
                                    px: 1,
                                    borderRadius: '999px',
                                    border: '1px solid gray'
                                }}
                            >
                                {condition}
                            </Typography>
                        </Stack>
                        {/* Description */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {description}
                        </Typography>
                    </Stack>
                </CardContent>
                <Stack direction={'row'} justifyContent={'space-between'} gap={1} alignItems={'center'}>
                    {/* Category */}
                    <Typography
                        variant="body2"
                        align='center'
                        sx={{ width: '100%', border: '1px solid black', alignSelf: 'center', color: 'black', p: .5, backdropFilter: 'blur(10px)', bgcolor: 'rgba(255, 255, 255, 255)', borderRadius: 1}}
                    >
                        - {isLocal ? 'Large' : 'Small'} item -
                    </Typography>
                    <Button
                        variant="text"
                        size="medium"
                        color='secondary'
                        onClick={addToCart}
                        sx={{
                            width: '10%',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 0,
                            borderRadius: 1,
                            bgcolor: '#37353E'
                        }}
                    >
                        <ShoppingCartIcon style={{color: 'white', fill: 'white'}}/>
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
}
