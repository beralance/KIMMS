// components/BottomActionBar.jsx
import React from "react";
import { Box, Paper } from "@mui/material";

const BottomActionBar = ({ children, backgroundColor }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 0,
                borderRadius: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                p: 2,
                backgroundColor: {backgroundColor}
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {children} 
            </Box>
        </Paper>
    );
};

export default BottomActionBar;
