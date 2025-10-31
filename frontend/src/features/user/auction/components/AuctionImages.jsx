import React from 'react'
import { Box, Grid, Stack } from '@mui/material'



const AuctionImages = () => {
    return (
        <Stack>
            <Grid container spacing={1} sx={{p: 1}}>
                <Grid size={{xs: 12}} height={200}>
                    <img 
                        src="/handcrafted-wooden-decorative-table.jpg"
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            height: '100%',
                            borderRadius: '5px',
                            width: '100%',
                        }}    
                    />    
                </Grid>  
                <Grid size={{xs: 6}} height={200}>
                    <img 
                        src="/top-view-dining-tables-without-food.jpg"
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            height: '100%',
                            borderRadius: '5px',
                            width: '100%',
                        }}    
                    />    
                </Grid>  
                <Grid size={{xs: 6}} height={200}>
                    <img 
                        src="/black-cup-bottle.jpg"
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

export default AuctionImages
