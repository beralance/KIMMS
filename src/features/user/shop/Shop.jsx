import { Box, Typography } from "@mui/material";
import ShopGrid from "./ShopGrid";
import React, { useState, useEffect } from "react";
import products from "../../../data/products";
import ShopPagination from "./ShopPagination";
import ShopFilters from "./ShopFilter";
import Container from "@mui/material/Container";
import AutoSlideCarousel from "../../../components/AutoSlideCarousel";

const PAGE_SIZE = 6;

function Shop() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("all");

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [sort, category]);

  // filter by category
  let filteredProducts = [...products];
  if (category !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  // sort
  if (sort === "price-low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // pagination
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
        <AutoSlideCarousel/>
        <Container maxWidth="lg">
            <Typography variant="h4" color="initial" sx={{m: 1, mb: 5}}>
                Welcome!
                One of a kind find are waiting for you!
            </Typography>
            <Box sx={{display: {md: 'flex'}, alignItems: 'start', justifyContent: {md: 'space-between'}, gap: {md: 5}}}>
                <Box sx={{position: {xs: 'static', md: 'sticky'}, top: {md: 20}}}>
                    <ShopFilters
                        sort={sort}
                        setSort={setSort}
                        category={category}
                        setCategory={setCategory}
                    />
                </Box>

                <Box>
                    <ShopGrid products={paginatedProducts} />
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
