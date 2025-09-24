import * as React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

export default function AddItemButton({ onOpen, open}) {
    return (
        <Box sx={{ position: 'fixed', bottom: 80, right: 16 }}>
            <IconButton
                onClick={onOpen}
                sx={{
                    bgcolor: !open ? '#37353E' : 'transparent',
                    color: !open ? 'white' : '#37353E' ,
                    width: 56,
                    height: 56,
                    boxShadow: !open ? 3 : 0 ,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: open ? '#37353E' : '#c0c0c0ff', 
                        color: open ? '#c0c0c0ff' : '#37353E',   
                        boxShadow: !open ? 6 : 2,      
                    },
                }}
            >
                {!open ? <AddIcon /> : <EditIcon/>}
            </IconButton>
        </Box>
    );
}
