// ProductManagement.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Grid,
    Typography,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack,
    Fade,
    Grow,
    Divider,
} from "@mui/material";
import { ProductContext } from "../../../../contexts/ProductContext";
import ProductCard from "../components/PostedProductCard";
import { useOutletContext } from "react-router-dom"; 
import FullScreenLoader from "../../../../components/FullScreenLoader";

function ProductManagement() {
    const { products, fetchProducts } = useContext(ProductContext);
    const [category, setCategory] = useState("all");
    const [highlight, setHighlight] = useState("all");
    const {searchTerm, setSearchTerm} = useOutletContext()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true)
            try {
                await fetchProducts();
            }
            catch(err) {
                console.error('Error fetching posted products:', err)
            }
            finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, []);

    const categories = useMemo(() => [...new Set(products.map((p) => p.category?.name))], [products]);

    const finalProducts = useMemo(() => {
        return products
            .filter(p => p.visibility !== 'inactive')
            .filter((p) => 
            {

            if (searchTerm) {
                const s = searchTerm.toLowerCase();
                if (
                    !p.productName?.toLowerCase().includes(s) &&
                    !p.category?.name?.toLowerCase().includes(s) &&
                    !p._id?.toLowerCase().includes(s)
                ) 
                return false;
            }

            if (category !== "all" && p.category?.name !== category) return false;
            if (highlight !== "all") {
                if (highlight === "featured" && p.highlight !== "featured") return false;
                if (highlight === "none" && p.highlight !== "none") return false;
            }

            return true;
        });
    }, [products, searchTerm, category, highlight]);

    return (
        <>
            <Box sx={{ pb: 4 }}>
                <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold' }} gutterBottom>
                    Posted Products
                </Typography>
                {finalProducts.length > 0 &&
                    <Typography variant="body2" color="grey" gutterBottom>
                        * The list below is the posted products that the customer can see and buy *
                    </Typography>
                }
            </Box>

            {/* Filters */}
            <Stack sx={{bgcolor: '#F0F0F0', borderRadius: 5, p: 2, boxShadow: 3}}>
                <Stack sx={{mb: 2}}>
                    {products.length > 0 &&
                        <Stack direction={'row'} sx={{gap: 2, mt: 2, width: '100%'}}>
                            <FormControl sx={{width: {xs: '100%'}}}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    variant="filled"
                                    value={category}
                                    label="Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                    sx={{
                                        maxHeight: 50,
                                        bgcolor: 'transparent',
                                    }}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{width: {xs: '100%', borderRadius: '999px'}}}>
                                <InputLabel>Highlight</InputLabel>
                                <Select
                                    value={highlight}
                                    variant="filled"
                                    label="Highlight"
                                    onChange={(e) => setHighlight(e.target.value)}
                                    sx={{
                                        bgcolor: 'transparent',
                                        maxHeight: 50,
                                    }}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="featured">Featured</MenuItem>
                                    <MenuItem value="none">None</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    }
                </Stack>
                {/* Products Grid */}
                <Grid container spacing={{ xs: 2, md: 2, lg: 3, xl: 2}} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                    {finalProducts.length > 0 ? (
                        finalProducts.map((product) => (
                            <Grid key={product._id} size={{ xs: 6, sm: 4, md: 3, lg: 3, xl: 2.4}} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ProductCard
                                    product={product}
                                    onEdit={(id) => console.log("Edit product:", id)}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Stack sx={{display: 'flex', width: '100%', mt: 5, justifyContent: 'center', alignItems: 'center'}}>
                            <Grow in={true} mountOnEnter unmountOnExit timeout={600}>
                                <img src="/confused.svg" alt="confused" style={{width: 60, opacity: .8, marginBottom: 10}}/>
                            </Grow>
                            <Typography variant="body1" color="secondary">
                                No products found.
                            </Typography>
                            <Typography variant="body2" color="grey">
                                You can post products using the + button
                            </Typography>
                        </Stack>
                    )}
                </Grid>
            </Stack>
            <FullScreenLoader open={loading} message="Getting posted products..."/>
        </>
    );
}

export default ProductManagement;
