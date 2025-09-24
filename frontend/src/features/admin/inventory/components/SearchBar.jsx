// src/features/admin/components/SearchBar.jsx
import { TextField, Box } from "@mui/material";

export default function SearchBar({ value, onChange, activeTab }) {
    const getPlaceholder = () => {
        switch (activeTab) {
            case 0: return "Search Inventory...";
            case 1: return "Search Products...";
            case 2: return "Search Auctions...";
            default: return "Search...";
        }
    };

    return (
        <Box>
            <TextField
                type="search" 
                sx={{
                    minWidth: '100%',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        px: '.5rem',
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
