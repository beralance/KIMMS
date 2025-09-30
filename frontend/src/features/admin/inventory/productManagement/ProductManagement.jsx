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
} from "@mui/material";
import { ProductContext } from "../../../../contexts/ProductContext";
import ProductCard from "../components/PostedProductCard";
import { useOutletContext } from "react-router-dom"; 

function ProductManagement() {
    const { products, fetchProducts, deleteProduct } = useContext(ProductContext);
    const [category, setCategory] = useState("all");
    const [highlight, setHighlight] = useState("all");
    const {searchTerm, setSearchTerm} = useOutletContext()

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        await deleteProduct(id);
    };

    // 🏷️ Extract categories dynamically
    const categories = useMemo(() => [...new Set(products.map((p) => p.category?.name))], [products]);

    // ✅ Filtered products
    const finalProducts = useMemo(() => {
        
        
        return products
            .filter(p => p.visibility !== 'inactive')
            .filter((p) => 
            {

            // Search filter
            if (searchTerm) {
                const s = searchTerm.toLowerCase();
                if (
                    !p.productName?.toLowerCase().includes(s) &&
                    !p.category?.name?.toLowerCase().includes(s) &&
                    !p._id?.toLowerCase().includes(s)
                ) 
                return false;
            }

            // Category filter
            if (category !== "all" && p.category?.name !== category) return false;

            // Highlight filter
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
            {products.length > 0 &&
                <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                    <FormControl sx={{ minWidth: 160 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 160 }}>
                        <InputLabel>Highlight</InputLabel>
                        <Select
                            value={highlight}
                            label="Highlight"
                            onChange={(e) => setHighlight(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="featured">Featured</MenuItem>
                            <MenuItem value="none">None</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            }

            {/* Products Grid */}
            <Grid container spacing={{ xs: 2, md: 2, lg: 3, xl: 2}} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                {finalProducts.length > 0 ? (
                    finalProducts.map((product) => (
                        <Grid key={product._id} size={{ xs: 6, sm: 4, md: 3, lg: 3, xl: 2.4}} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ProductCard
                                product={product}
                                onEdit={(id) => console.log("Edit product:", id)}
                                onDelete={handleDelete}
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
        </>
    );
}

export default ProductManagement;
