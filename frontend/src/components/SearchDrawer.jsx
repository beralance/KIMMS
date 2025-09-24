// SearchDrawer.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "./SearchBar"; // adjust path if needed
import Typography from "@mui/material/Typography";
import { Stack, List, ListItem, ListItemButton, Divider, Container, Grow, Fade } from "@mui/material";
import { ProductContext } from "../contexts/ProductContext"; // adjust path
import { useContext, useState } from "react";
import ProductCardSimple from './ProductCardSimple'
import { useNavigate } from 'react-router-dom'
import SearchRecommended from './SearchRecommended'
import { UPLOADS_URL } from '../utils/constants'

export default function SearchDrawer({ open, onClose, anchor = "top" }) {
    const { searchProducts, products } = useContext(ProductContext);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate()

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setResults([]);
            return;
        }
        const data = await searchProducts(value); // fetch from context
        setResults(data || []);
    };

    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    height: { xs: "100%" },
                    p: 2,
                    borderRadius: { xs: 0, sm: "0 0 16px 16px" }, // rounded bottom for top drawer
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                }}
            >
                <Box sx={{ width: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body1" color="initial" sx={{ marginLeft: 1 }}>
                            K I M M S
                        </Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Stack>
                        <Box sx={{ flex: 1, mb: results.length > 0 && 2 }}>
                            <SearchBar
                                autoFocus
                                fullWidth
                                value={query}
                                onResults={setResults}
                                onChange={handleSearch}
                            />
                        </Box>
                        {/* Search Results */}
                        <Typography variant="body1" color="grey" sx={{m: results.length > 0 && 2}}>
                            {results.length > 0 && 'Search Result'}
                        </Typography>
                        {results.length > 0 && (
                            <List sx={{maxHeight: 400, overflowY: 'auto', borderRadius: 2, p: 0}}>
                                {results.map((product) => (
                                    <Box key={product._id}>
                                        <Grow timeout={800} in={results.length > 0} mountOnEnter unmountOnExit>
                                            <ListItem disablePadding>
                                                <ListItemButton 
                                                    onClick={() => {
                                                        navigate(`/product/${product._id}`);
                                                        window.scrollTo({top: 0, behavior: 'smooth'})
                                                        onClose();
                                                    }}
                                                >
                                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderRadius: 1}}>
                                                        <Box>
                                                            <Typography gutterBottom noWrap fontWeight='bold'>
                                                                {product.productName} 
                                                            </Typography>
                                                            <Typography noWrap color="secondary" variant="body2">
                                                                <span style={{color: 'black', fontWeight: 'bold'}}>PHP </span>{product.price}
                                                            </Typography>
                                                            <Typography noWrap color="grey" variant="body2">
                                                                {product.description}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{width: 100}}>
                                                            <img src={`${UPLOADS_URL}${product.image}`} alt={product.productName} style={{objectFit: 'cover', aspectRatio: '1/1', width: '100%', borderRadius: 3}}/> 
                                                        </Box>
                                                    </Box>
                                                </ListItemButton>
                                            </ListItem>
                                        </Grow>
                                        <Container>
                                            <Divider/>
                                        </Container>
                                    </Box>
                                ))}
                            </List>
                        )}
                        <Box sx={{mt: results.length > 0 && 5}}>
                            <Typography variant="body1" color="grey" sx={{m: 2}}>
                                Recommendation
                            </Typography>
                            <Box>
                                <SearchRecommended products={products}/>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Drawer>
    );
}
