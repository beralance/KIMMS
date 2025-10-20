// src/features/admin/components/SearchBar.jsx
import { TextField, Box } from "@mui/material";

export default function SearchBar({ value, onChange, activeTab }) {
    const getPlaceholder = () => {
        switch (activeTab) {
            case 'manage-inventory': return "Search Inventory...";
            case 'manage-product': return "Search Products...";
            case 'manage-auction': return "Search Auctions...";
            default: return "Search...";
        }
    };

    return (
        <Box>
            <TextField
                type="search" 
                placeholder="Search product..."
                sx={{
                    minWidth: '100%',            
                    '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        px: '.5rem',
                        color: 'white',
                        height: 40,
                        display: 'flex',
                        borderRadius: '999px',
                        borderColor: 'white',
                        '& fieldset': {
                            color: 'white',
                            borderColor: '#bbbbbbff',
                            minHeight: 40,
                            boxShadow:'0px 0px 1px rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                            borderColor: 'white'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                            boxShadow:'0px 1px 3px rgba(255, 255, 255, 0.5)'
                        }
                    },
                    '& .MuiInputLabel-root': {
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: -7,
                        opacity: .7,
                        color: 'white',        
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'red',        
                        mt: 1,     
                    },
                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                        fontSize: '0.8rem',       
                        color: 'white',         
                    },
                    '& .MuiInputBase-input': {
                        bgcolor: "transparent",
                        p: 1,
                        '& fieldset': {
                            bgcolor: 'blue',
                        },
                    }
                }}
                fullWidth
                variant="outlined"
                label={getPlaceholder()}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </Box>
    );
}
