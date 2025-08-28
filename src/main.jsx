import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme} from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './index.css'
import App from './App.jsx'

// theme that can be costumized later
const theme = createTheme ({
    pallete: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        }
    }
})


createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline/> {/* Reset and normalize css */}
                    <App/>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
  
)
