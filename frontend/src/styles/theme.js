import { Typography, typographyClasses } from '@mui/material'
import { createTheme } from '@mui/material/styles'

// Black 37353E
// Component BG '#F0F0F0'
// Dark White D3DAD9
// Main White BG f0f0f0ff

const theme = createTheme({
    palette: { 
        secondary: {main: '#37353E'},
    },
    typography: {
        fontFamily: ['Poppins', 'Helvetica Neue', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'].join(','),
        h1: {
            fontFamily: [
                'Playfair Display',
                'Didot',
                'Bodoni MT',
                'Garamond',
                'Times New Roman',
                'serif'
            ].join(','),
        },
        h2: {
            fontFamily: [
                'Playfair Display',
                'Didot',
                'Bodoni MT',
                'Garamond',
                'Times New Roman',
                'serif'
            ].join(','),
        },
        h3: {
            fontFamily: [
                'Playfair Display',
                'Didot',
                'Bodoni MT',
                'Garamond',
                'Times New Roman',
                'serif'
            ].join(','),
        },
        h4: {
            fontFamily: [
                'Playfair Display',
                'Didot',
                'Bodoni MT',
                'Garamond',
                'Times New Roman',
                'serif'
            ].join(','),
        },
        h5: {
            fontFamily: [
                'Playfair Display',
                'Didot',
                'Bodoni MT',
                'Garamond',
                'Times New Roman',
                'serif'
            ].join(','),
        },
        h6: {
            fontFamily: [
                'Playfair Display',
                'Didot',
                'Bodoni MT',
                'Garamond',
                'Times New Roman',
                'serif'
            ].join(','),
        },
        body1: {
            fontFamily: [
                'Poppins', 
                'Helvetica Neue', 
                'Segoe UI', 
                'Tahoma', 
                'Geneva', 
                'Verdana', 
                'sans-serif'
            ].join(','),
            fontWeight: 300,
            lineHeight: 1.7,
            letterSpacing: '0.02em',
        },
        body2: {
            fontFamily: [
                'Poppins', 
                'Helvetica Neue', 
                'Segoe UI', 
                'Tahoma', 
                'Geneva', 
                'Verdana', 
                'sans-serif'
            ].join(','),
            fontWeight: 300,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
        },
        button: {
            textTransform: 'none'
        },
        subtitle1: {
           fontFamily: [
                'Poppins', 
                'Helvetica Neue', 
                'Segoe UI', 
                'Tahoma', 
                'Geneva', 
                'Verdana', 
                'sans-serif'
            ].join(','),
            fontWeight: 380,
            lineHeight: 1.7,
            fontSize: '1.1rem',
            letterSpacing: '0.02em',
        },
        subtitle2: {
            fontFamily: [
                'Poppins', 
                'Helvetica Neue', 
                'Segoe UI', 
                'Tahoma', 
                'Geneva', 
                'Verdana', 
                'sans-serif'
            ].join(','),
            fontWeight: 350,
            lineHeight: 1.7,
            fontSize: '1rem',
            letterSpacing: '0.02em',
        },
    },
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
        },
        MuiSelect: {
            styleOverrides: {
                root: {}
            }
        }
    }
})

export default theme