import { Box, Divider, Stack, Typography } from '@mui/material'
import { ChevronRightIcon, PlayIcon } from 'lucide-react'
import React from 'react'

const DataCard = ({subLabel, img, label, value, icon}) => {
    return (
        <Box sx={{ width: '100%', borderRadius: 2}}>
            <Stack direction={'row'} gap={1}>
                <Divider orientation='vertical' style={{height: 'auto', borderRadius: '999px', border: '2px solid #757575ff'}}/>
                <Typography variant="subtitle2" color="secondary">
                    {label}
                </Typography>
            </Stack>
            <Stack direction={'row'} gap={2} sx={{p: 1}}>
                <Stack sx={{flexGrow: 1}}>
                    <Box>
                        <img 
                            src={img}
                            style={{
                                display: 'block',
                                width: '100px',
                                height: '100px',
                                aspectRatio: '1/1',
                            }}
                        />
                    </Box>
                </Stack>
                <Stack sx={{flexGrow: 3}} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h4" color="initial" align='center'>{value}</Typography>
                    <Typography variant="body2" color="gray" align='center'>{subLabel}</Typography>
                </Stack>
            </Stack>
        </Box>
    )
}

export default DataCard
