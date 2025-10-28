import React from 'react'
import { ScrollTextIcon } from  'lucide-react'
import { Box, Grid, Stack, } from '@mui/material'
import { useReport } from '../../../../contexts/ReportContext'
import InventoryDataCard from './InventoryDataCard'

const ListingOverview = () => {
    const {activeProducts, pendingAuctions, inventoryItems, liveAuctions, } = useReport()
    
    return (
        <Box>
            <Stack>
                <Grid container spacing={1}>
                    {[
                        { label: "Inventory", value: inventoryItems, color: 'darkgray'},
                        { label: "Products", value: activeProducts, color: '#e4ba00ff'},
                        { label: "Live", value: liveAuctions, color: '#d81212ff'},
                        { label: "Pending", value: pendingAuctions, color: '#2612d8ff'},
                    ].map((item, index) => (
                        <Grid size={{xs: 6}} key={index}>
                            <Box sx={{bgcolor: '#f0f0f0', p: 2, borderRadius: 2}}>
                                <InventoryDataCard 
                                    color={item.color}
                                    label={item.label} 
                                    value={item.value} 
                                    subLabel={item.subLabel}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Box>
    )
}

export default ListingOverview
