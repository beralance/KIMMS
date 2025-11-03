import { Box, Divider, Stack, Typography } from '@mui/material'
import { ChevronRightIcon, PlayIcon } from 'lucide-react'
import React from 'react'

const InventoryDataCard = ({label, value, color}) => {
    return (
        <Box sx={{ width: '100%', borderRadius: 2}}>
            <Stack direction={'row'} gap={1}>
                <Divider orientation='vertical' style={{height: 'auto', borderRadius: '999px', border: `2px solid ${color}`}}/>
                <Typography variant="subtitle2" color="white">
                    {label}
                </Typography>
            </Stack>
            <Stack alignItems={'center'} justifyContent={'center'} width={'100%'} direction={'row'} gap={1}>
                <Typography variant="h5" color="white" align='center'>{value}</Typography>
            </Stack>
        </Box>
    )
}

export default InventoryDataCard
