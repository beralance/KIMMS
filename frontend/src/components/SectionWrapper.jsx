import React from 'react'
import { Box, Stack } from '@mui/material'

const SectionWrapper = ({children, sx}) => {
    return (
        <Box>
            <Stack sx={{p: 2, bgcolor: 'white', borderRadius: 2, ...sx}}>
                {children}
            </Stack>
        </Box>
    )
}

export default SectionWrapper
