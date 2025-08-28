import Box from "@mui/material/Box"
import React from 'react'
import Button from '@mui/material/Button'
import { NavLink } from "react-router-dom"

const NotFound = () => {
    return (
        <Box>
            <h1>404 not found</h1>
            <Button component={NavLink} to='/' variant="text" color="primary">
              To Home
            </Button>
        </Box>
    )       
}

export default NotFound
