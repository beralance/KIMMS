import React from 'react'
import {Box, Card, CardContent, Grid, Typography} from '@mui/material'
import DataCard from './DataCard'
import {formatNumber} from '../../../../utils/stringUtils'
import SectionWrapper from '../../../../components/SectionWrapper'
import { ListCheckIcon, ScrollTextIcon } from 'lucide-react'


const BasicDataSection = ({totalProducts, inventoryItems, totalOrders, totalRevenue, liveAuctions, activeListings}) => {
    return (
        <>
            <Grid container spacing={1}>
                {[
                { label: "Total Revenue", value: `₱ ${formatNumber(totalRevenue)}`, subLabel: 'income earned'},
                { label: "Total Products", value: totalProducts, subLabel:  'overall products'},
                { label: "Inventory Items", value: inventoryItems, subLabel: 'non posted products'},
                { label: "Active Listings", value: activeListings, subLabel: 'posted products'},
                ].map((item, index) => (
                    <Grid size={{xs: 12}} key={index}>
                        <Box sx={{bgcolor: '#f0f0f0', p: 2, borderRadius: 2}}>
                            <DataCard 
                                icon={<ScrollTextIcon/>}
                                label={item.label} 
                                value={item.value} 
                                img={'/reports/credit-report.svg'}
                                subLabel={item.subLabel}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default BasicDataSection
