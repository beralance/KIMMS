import { TextField, Box } from "@mui/material"

export default function SearchBar ({ placeholder='Search', height, ...props}) {
    return (
        <Box sx={{
            border: 'none',
            borderRadius: '50%'
        }}>
            <TextField 
                variant="outlined"
                placeholder={placeholder}
                type="search" 
                sx={{
                    minWidth: '100%',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '999px',
                        px: '.5rem',
                        height: {height},
                        '& fieldset': {
                            borderColor: 'grey'
                        },
                        '&:hover fieldset': {
                            borderColor: 'grey'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'transparent',
                            boxShadow:'0px 1px 3px rgba(0, 0, 0, 0.5)'
                        }
                    }

            }}>

            </TextField>
        </Box>
    )
}