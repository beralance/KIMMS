import React from 'react'
import { Alert, Snackbar } from '@mui/material'

const CustomSnackbar = ({open, onClose, message, severity = 'success'}) => {
    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                autoHideDuration={3000}
                onClose={onClose}
            >
                <Alert onClose={onClose} severity={severity} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default CustomSnackbar
