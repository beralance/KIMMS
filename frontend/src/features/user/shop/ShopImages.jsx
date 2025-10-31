import React from 'react'
import { Box, Grid, Stack } from '@mui/material'



const ShopImages = () => {
    return (
        <Stack>
            <Box>
                <img 
                    src="/kimms-text.svg"
                    style={{
                        display: 'block',
                        objectFit: 'cover',
                        height: '100%',
                        width: '100%',
                    }}    
                /> 
                <img 
                    src="/kimms-text.svg"
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'block',
                        margin: '0 auto',
                        transform: 'scaleY(-1)',
                        opacity: 0.4,
                        maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', 
                        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                        marginTop: -15,
                    }} 
                />
            </Box>
            <Grid container spacing={1} sx={{p: 1}}>
                <Grid size={{xs: 12}} height={200}>
                    <img 
                        src="/background01.jpg"
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            height: '100%',
                            borderRadius: '5px',
                            width: '100%',
                        }}    
                    />    
                </Grid>  
                <Grid size={{xs: 6}} height={150}>
                    <img 
                        src="/view-photo-frame-with-interior-home-decor.jpg"
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            height: '100%',
                            borderRadius: '5px',
                            width: '100%',
                        }}    
                    />    
                </Grid>  
                <Grid size={{xs: 6}} height={150}>
                    <img 
                        src="/home-background.jpg"
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            height: '100%',
                            borderRadius: '5px',
                            width: '100%',
                        }}    
                    />    
                </Grid>  
                <Grid size={{xs: 12}} height={150}>
                    <img 
                        src="/yellow-armchair-living-room-with-copy-space.jpg"
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            height: '100%',
                            borderRadius: '5px',
                            width: '100%',
                        }}    
                    />    
                </Grid>  
            </Grid>
        </Stack>
    )   
}

export default ShopImages 
