import { Typography, typographyClasses } from '@mui/material'
import { createTheme } from '@mui/material/styles'

// Black 37353E
// Dark White D3DAD9

const theme = createTheme({
    // palette: colors system
    palette: { 
        secondary: {main: '#37353E'},
    },
    // typography: global font styles
    typography: {
        fontFamily: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        h1: {},
        body1: {},
        button: {
            textTransform: 'none'
        },
    },
    // components: overrides and default props for MUI components
    components: {
        MuiButton: {
            styleOverrides: {
                root: {}
            }
        },
        MuiSvgIcon: {
            root: {
                color: '#000000ff'
            }
        }
    }
    // mode: light/dark theme switching
})

export default theme