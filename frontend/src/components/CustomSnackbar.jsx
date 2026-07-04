import React, { useEffect, useState, useRef } from 'react'
import { Alert, Snackbar } from '@mui/material'

const CustomSnackbar = ({ open, onClose, message, severity = 'success' }) => {
    const [queue, setQueue] = useState([])
    const lastMessageRef = useRef('')

    useEffect(() => {
        if (open && message && message !== lastMessageRef.current) {
            lastMessageRef.current = message
            setQueue(prev => [
                ...prev,
                { id: Date.now(), message, severity }
            ])
        }
    }, [open, message, severity])

    const handleClose = (id) => {
        setQueue(prev => prev.filter(item => item.id !== id))
        if (onClose) onClose()
    }

    return (
        <>
            {queue.map(item => (
                <Snackbar
                    key={item.id}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open
                    autoHideDuration={3000}
                    onClose={() => handleClose(item.id)}
                    sx={{ mb: queue.indexOf(item) * 7 }}
                >
                    <Alert
                        onClose={() => handleClose(item.id)}
                        severity={item.severity}
                        sx={{ width: '100%' }}
                    >
                        {item.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    )
}

export default CustomSnackbar
