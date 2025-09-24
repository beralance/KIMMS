import React from 'react'
import { CartProvider, useCart } from '../contexts/CartContext'
import CustomSnackbar from './CustomSnackbar'

function SnackbarWrapper () {
    const {notification, setNotification} = useCart()

    return notification ? (
        <CustomSnackbar
            open={!!notification}
            onClose={() => setNotification(null)}
            message={notification.message}
            severity={notification.severity}
        />
    ) : null
}
export default SnackbarWrapper

