import React from 'react'
import InventoryTable from '../components/InventoryTable';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useOutletContext } from 'react-router-dom';
import { Stack } from '@mui/material';
import InventoryCharts from './InventoryCharts';


const InventoryManagement = () => {
    const {searchTerm, setSearchTerm} = useOutletContext()
    
    return (
        <div>
            <Box sx={{pb: 4}}>
                <Typography variant="h6" color="secondary" sx={{fontWeight: 'bold'}} gutterBottom>
                    Inventory List
                </Typography>
                <Typography variant="body2" color="grey" gutterBottom>
                    The list are products that have not been released, it's not available to customer yet.
                    You can add it in <b>Manage Products</b> to post it so that customer can purchase the product or sell it using <b>Manage Auction</b>
                </Typography>
            </Box>
            <Box>
                <Typography variant="body1" color="initial">Chart</Typography>
                <InventoryCharts/>
            </Box>
            <InventoryTable searchTerm={searchTerm}/>
        </div>
    )
}

export default InventoryManagement
