import React, { useState } from 'react'
import InventoryTable from '../components/InventoryTable';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useOutletContext } from 'react-router-dom';
import { Collapse, Stack, IconButton } from '@mui/material';
import InventoryCharts from './InventoryCharts';
import { InfoRounded } from '@mui/icons-material';

const InventoryManagement = () => {
    const {searchTerm, setSearchTerm} = useOutletContext()
    const [note, setNote] = useState(false)

    return (
        <div>
            <Box sx={{pb: 4}}>
                <Typography variant="body2" color="grey" gutterBottom>
                    The list are products that have not been released, it's not available to customer yet.
                    You can add it in <b>Manage Products</b> to post it so that customer can purchase the product or sell it using <b>Manage Auction</b>
                </Typography>
            </Box>

            {/* Main Content*/}
            <Stack gap={5}>
                {/* Chart */}
                <Box component={'section'} sx={{bgcolor: '#F0F0F0', borderRadius: 5, p: 2, boxShadow: 3 }}>
                    <Stack  pb={1}>
                        <Stack justifyContent={'space-between'} direction={'row'} alignItems={'center'}>
                            <Typography variant="h6" color="secondary" sx={{fontWeight: 'bold'}}>
                                Stock Info
                            </Typography>
                            <IconButton onClick={() => setNote((prev) => !prev)}>
                                <InfoRounded color='grey'/>                          
                            </IconButton>
                        </Stack>
                        <Collapse in={note} timeout={800} orientation='vertical'>
                            <Typography variant="body2" color="grey" gutterBottom>
                                The list are products that have not been released, it's not available to customer yet.
                                You can add it in <b>Manage Products</b> to post it so that customer can purchase the product or sell it using <b>Manage Auction</b>
                            </Typography>
                        </Collapse>
                    </Stack>
                    <InventoryCharts/>
                </Box>

                {/* Table */}
                <Box component={'section'} sx={{bgcolor: '#F0F0F0', borderRadius: 5, p: 2, boxShadow: 3}}>
                    <Stack  pb={1}>
                        <Stack justifyContent={'space-between'} direction={'row'} alignItems={'center'}>
                            <Typography variant="h6" color="secondary" sx={{fontWeight: 'bold'}}>
                                Inventory List
                            </Typography>
                            <IconButton onClick={() => setNote((prev) => !prev)}>
                                <InfoRounded color='grey'/>                          
                            </IconButton>
                        </Stack>
                        <Collapse in={note} timeout={800} orientation='vertical'>
                            <Typography variant="body2" color="grey" gutterBottom>
                                The list are products that have not been released, it's not available to customer yet.
                                You can add it in <b>Manage Products</b> to post it so that customer can purchase the product or sell it using <b>Manage Auction</b>
                            </Typography>
                        </Collapse>
                    </Stack>
                    <InventoryTable searchTerm={searchTerm}/>
                </Box>
            </Stack>
        </div>
    )
}

export default InventoryManagement
