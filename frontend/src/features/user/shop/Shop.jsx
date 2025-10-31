import { Box, Divider, Stack, Typography } from "@mui/material";
import ShopGrid from "./ShopGrid";
import React, { useState, useEffect, useContext, useRef } from "react";
import ShopPagination from "./ShopPagination";
import ShopFilters from "./ShopFilter";
import Container from "@mui/material/Container";
import { useCart } from "../../../contexts/CartContext";
import { ProductContext } from "../../../contexts/ProductContext"; // import context
import { scrollToTop } from "../../../utils/scroll";
import { scrollTo } from "../../../utils/scrollRef";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useLocation, useParams } from "react-router-dom";
import FullScreenLoader from "../../../components/FullScreenLoader";
import SectionWrapper from "../../../components/SectionWrapper";
import ShopImages from "./ShopImages";
import ShopHero from "./ShopHero";
import Suggestion from "./Suggestion";
import { GalleryHorizontalEndIcon, SparkleIcon, StarHalfIcon, StarIcon, UserStarIcon } from "lucide-react";

function Shop() {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("default");
    const [category, setCategory] = useState("all");
    const [categoryName, setCategoryName] = useState('Remove')
    const [loading, setLoading] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState([]);

    const { addToCart } = useCart();
    const { products, fetchProducts } = useContext(ProductContext); // get products from context
    const {showSnackbar} = useSnackbar()
    const mainSection = useRef()

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const categoryId = queryParams.get('category')
    const PAGE_SIZE = 6;


    // reset page when filters change
    useEffect(() => {
        scrollToTop()
        setPage(1);
    }, [sort, category]);

    // fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // filter and sort whenever products, category, or sort changes
    useEffect(() => {
        let tempProducts = [...products];
        setLoading(true)

        try {
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
        }
        catch (err) {
            useSnackbar('Problem fetching product list: ', err, 'warning')
        }
        finally {
            setLoading(false)
        }
    }, [products, category, sort, categoryId]);

    
    const mostViewedProducts = products
        .filter(p => p.views)
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

    const featuredProduct = products
        .filter(p => p.highlight === 'featured')

    // pagination
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    const handlePageChange = (event, value) => {
        setPage(value);
        scrollTo(mainSection)
    };

    // Add to cart — no local snackbar needed
    const handleAddToCart = (product) => {
        addToCart(product);
    };


    return (
        <Box sx={{bgcolor:'#fafafa', }}>
            <ShopHero/>
            <Container maxWidth="lg">
                <Stack gap={5} pt={8}>
                    <Stack>
                        <Stack alignItems={'center'}>
                            <img 
                                src="/kimms-logo.svg"
                                style={{
                                    display: 'block',
                                    objectFit: 'cover',
                                    height: '40px',
                                    width: '40px',
                                }}    
                            /> 
                            <Typography variant="h5" color="secondary" align="center">
                                Welcome! One of a kind find are waiting for you!
                            </Typography>
                        </Stack>
                        <ShopImages/>
                    </Stack>
                    <Suggestion
                        icon={<UserStarIcon/>}
                        label={'Most Viewed'}
                        subLabel={'Discover the items catching everyone’s attention'}
                        products={mostViewedProducts}
                    />
                    <Suggestion
                        icon={<SparkleIcon />}
                        label={'Spotlight Products'}
                        subLabel={'A selection of standout items you shouldn’t miss.'}
                        products={featuredProduct}
                    />
                    <Box ref={mainSection}>
                        <Divider sx={{my: 1}}>
                            <Typography variant="body2" color="gray">
                                Gallery
                            </Typography>
                        </Divider>
                    </Box>
                    <Box>
                        <SectionWrapper sx={{bgcolor: '#f0f0f0'}}>
                            <Stack gap={3}>
                                <Stack>
                                    <Typography variant="subtitle1" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <GalleryHorizontalEndIcon style={{fill: "black"}}/>
                                        Product Gallery
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        Curated pieces, ready for your home
                                    </Typography>
                                </Stack>
                                <Stack>
                                    {products ?
                                        <>
                                            <Box>
                                                <ShopFilters
                                                    sort={sort}
                                                    setSort={setSort}
                                                    category={category}
                                                    filteredProducts={filteredProducts}
                                                    setCategory={setCategory}
                                                    categoryName={typeof categoryName === "string" ? categoryName : JSON.stringify(categoryName)}
                                                    categoryId={categoryId}
                                                />
                                            </Box>
                                            <ShopGrid
                                                products={paginatedProducts}
                                                handleAddToCart={handleAddToCart} // pass down to ShopGrid / ProductCard
                                            />
                                        </>
                                        :
                                        <Stack alignItems={'center'} justifyContent={'center'} gap={2} height={'40vh'}>
                                            <img 
                                                src="/emoji-sick-svgrepo-com.svg"
                                                style={{
                                                    display: 'block',
                                                    width: '60px',
                                                    height: '60px',
                                                    opacity: '0.8'
                                                }}
                                            />
                                            <Stack>
                                                <Typography variant="subtitle2" color="secondary" align="center">No products found</Typography>
                                                <Typography variant="body2" color="gray" align="center">
                                                    We’re updating our catalog. Check back soon for new items!
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    }
                                </Stack>
                            </Stack>
                        </SectionWrapper>
                        {products &&
                            <Box sx={{mt: 5}}>
                                <ShopPagination
                                    count={Math.ceil(filteredProducts.length / PAGE_SIZE)}
                                    page={page}
                                    onChange={handlePageChange}
                                />
                            </Box>
                        }
                    </Box>
                </Stack>
            </Container>
            <FullScreenLoader open={loading}/>
        </Box>
    );
}

export default Shop;
