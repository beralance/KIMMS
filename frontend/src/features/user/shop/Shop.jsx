import { Box, Typography } from "@mui/material";
import ShopGrid from "./ShopGrid";
import React, { useState, useEffect, useContext } from "react";
import ShopPagination from "./ShopPagination";
import ShopFilters from "./ShopFilter";
import Container from "@mui/material/Container";
import AutoSlideCarousel from "../../../components/AutoSlideCarousel";
import { useCart } from "../../../contexts/CartContext";
import { ProductContext } from "../../../contexts/ProductContext"; // import context
import { ScrollOnTop } from "../../../utils/ScrollOnTop";
import { useLocation, useParams } from "react-router-dom";

const PAGE_SIZE = 6;

function Shop() {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("default");
    const [category, setCategory] = useState("all");
    
    const { addToCart } = useCart();
    const { products, fetchProducts } = useContext(ProductContext); // get products from context
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('Remove')
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const categoryId = queryParams.get('category')

    ScrollOnTop()

    // reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [sort, category]);

    // fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // filter and sort whenever products, category, or sort changes
    useEffect(() => {
        let tempProducts = [...products];

        if (categoryId) {
             tempProducts = tempProducts.filter((p) => p.category?._id === categoryId);
        }
        // 🔹 Otherwise fall back to the dropdown/category filter
        else if (category !== "all") {
            tempProducts = tempProducts.filter((p) => p.category?._id === category);
        }

        // sort
        if (sort === "price-low-high") {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sort === "price-high-low") {
            tempProducts.sort((a, b) => b.price - a.price);
        }

         if (categoryId) {
            const matched = products.find((p) => p.category?._id === categoryId);
            setCategoryName(matched ? matched.category.name : "All");
         }

        setFilteredProducts(tempProducts);
    }, [products, category, sort, categoryId]);

    // pagination
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Add to cart — no local snackbar needed
    const handleAddToCart = (product) => {
        addToCart(product);
    };

    return (
        <Box>
            <AutoSlideCarousel />
            <Container maxWidth="lg">
                <Typography variant="h5" color="initial" sx={{ m: 1, mb: 5 }}>
                    Welcome! One of a kind find are waiting for you!
                </Typography>
                <Box
                    sx={{
                        display: { md: "flex" },
                        alignItems: "start",
                        justifyContent: { md: "space-between" },
                        gap: { md: 5 },
                    }}
                >
                    <Box sx={{ position: { xs: "static", md: "sticky" }, top: { md: 20 } }}>
                        <ShopFilters
                            sort={sort}
                            setSort={setSort}
                            category={category}
                            setCategory={setCategory}
                            categoryName={categoryName}
                            categoryId={categoryId}
                        />
                        <Typography variant="body1" color="initial"></Typography>
                    </Box>
                    <Box>
                        <ShopGrid
                            products={paginatedProducts}
                            handleAddToCart={handleAddToCart} // pass down to ShopGrid / ProductCard
                        />
                        <ShopPagination
                            count={Math.ceil(filteredProducts.length / PAGE_SIZE)}
                            page={page}
                            onChange={handlePageChange}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Shop;
