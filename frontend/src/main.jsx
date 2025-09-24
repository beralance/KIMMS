import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { CheckoutProvider } from './contexts/CheckoutContext.jsx'
import { InventoryProvider } from './contexts/InventoryContext.jsx'
import { ProductProvider } from './contexts/ProductContext.jsx'
import { SnackbarProvider } from './contexts/SnackbarContext.jsx'
import { OrderProvider } from './contexts/OrderContext.jsx'

import CssBaseline from '@mui/material/CssBaseline'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './index.css'
import App from './App.jsx'
import theme from './styles/theme.js'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <SnackbarProvider>
                <AuthProvider>
                    <InventoryProvider>
                        <ProductProvider>
                            <CartProvider>
                                <CheckoutProvider> 
                                    <OrderProvider>
                                        <ThemeProvider theme={theme}>
                                            <CssBaseline/> {/* Reset and normalize css */}
                                            <App/>
                                        </ThemeProvider>
                                    </OrderProvider>
                                </CheckoutProvider>
                            </CartProvider>
                        </ProductProvider>
                    </InventoryProvider>
                </AuthProvider>
            </SnackbarProvider>
        </BrowserRouter>
    </React.StrictMode>
  
)
