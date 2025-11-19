import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Container,
    Divider,
    Stack,
} from "@mui/material";
import { useCart } from "../../../contexts/CartContext";
import { ProductContext } from "../../../contexts/ProductContext"; // import context
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import ProductCartRecommendation from "../../../components/ProductCardRecommendation";
import BottomActionBar from "../../../components/BottomActionBar";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useCheckout } from "../../../contexts/CheckoutContext";
import { ScrollOnTop } from "../../../utils/ScrollOnTop";
import { toTitleCase, formatNumber } from "../../../utils/stringUtils";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SellRounded } from "@mui/icons-material";
import SectionWrapper from "../../../components/SectionWrapper";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { ChevronRightIcon } from "lucide-react";

export default function ProductDetails() {
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const { products, incrementViews } = useContext(ProductContext);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { setCheckoutItems } = useCheckout();
    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [imageOpen, setImageOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const hasIncremented = useRef(false);

    ScrollOnTop();

    useEffect(() => {
        if (!hasIncremented.current && id) {
            incrementViews(id);
            hasIncremented.current = true;
        }
    });

    useEffect(() => {
        setLoading(true);

        try {
            if (products.length === 0) return;
            const found = products.find((p) => String(p._id) === String(id)); // <--- convert to string
            setProduct(found);

            if (found) {
                const recs = products.filter(
                    (p) =>
                        p?.category?._id === found.category?._id &&
                        String(p._id) !== String(found._id)
                );
                setRecommendations(recs);
            }
        } catch (err) {
            console.error("Error fetching product detail:", err);
            showSnackbar("Can't get product details", "error");
        } finally {
            setLoading(false);
        }
    }, [products, id]);

    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleCheckout = () => {
        setCheckoutItems([{ ...product }]);
        navigate("/checkout", { replace: true });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 0, md: 4 },
            }}
        >
            {/* Back button */}
            <Box sx={{ position: "fixed", top: 0, m: 2, zIndex: 1000 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(-1) || navigate("/shop")}
                    sx={{ color: "white", borderRadius: "999px" }}
                >
                    <ArrowBackIcon sx={{ fontSize: 25 }} />
                </Button>
            </Box>

            {/* Product Image */}
            <Box
                onClick={() => setImageOpen(true)}
                sx={{
                    height: "70vh",
                    bgcolor: "white",
                    position: "sticky",
                    top: 0,
                    left: 0,
                    width: "100%",
                }}
            >
                <Box sx={{ width: "100%" }}>
                    <Swiper
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "--swiper-pagination-color": "white",
                            "--swiper-pagination-bullet-inactive-color": "#ccc",
                            "--swiper-pagination-bullet-size": "8px",
                        }}
                    >
                        {Array.isArray(product?.images) &&
                            product?.images.length > 0 &&
                            product?.images.map((img, idx) => (
                                <SwiperSlide
                                    key={idx}
                                    style={{ height: "70vh" }}
                                >
                                    <Box
                                        sx={{
                                            justifySelf: "center",
                                            height: "100%",
                                            width: "100%",
                                        }}
                                    >
                                        <img
                                            src={`${img}`}
                                            alt={`${product?.productName}`}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                height: "100%",
                                                backgroundColor: "white",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </Box>
            </Box>
            <Box
                sx={{
                    height: "100%",
                    minHeight: "100vh",
                    color: "white",
                    position: "relative",
                    mt: -1,
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "10px 10px 0px 0px",
                    boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Container
                    sx={{
                        flex: { xs: 0, md: 1 },
                        bgcolor: "white",
                        borderRadius: "10px 10px 0px 0px",
                        py: 2,
                        pb: 10,
                    }}
                >
                    <section>
                        <Stack gap={2}>
                            <Stack sx={{ gap: 4 }}>
                                <Stack gap={1}>
                                    <Stack direction={"row"}>
                                        <Box
                                            sx={{
                                                bgcolor: "black",
                                                opacity: 0.8,
                                                borderRadius: 1,
                                                width: 5,
                                                mr: 2,
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            color="secondary"
                                            fontWeight={"bold"}
                                            maxWidth={"80%"}
                                        >
                                            {product?.productName}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                    >
                                        <SellRounded
                                            color="error"
                                            sx={{ mr: 1 }}
                                        />
                                        <Typography
                                            variant="body1"
                                            color="error"
                                            fontWeight={"bold"}
                                        >
                                            Php {formatNumber(product?.price)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    alignItems={"center"}
                                    gap={1}
                                >
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        sx={{
                                            border: 1,
                                            px: 2,
                                            borderRadius: "999px",
                                        }}
                                    >
                                        {product?.category?.name}
                                    </Typography>
                                    <Divider orientation="vertical" flexItem />
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        sx={{
                                            border: 1,
                                            px: 2,
                                            borderRadius: "999px",
                                        }}
                                    >
                                        {toTitleCase(product?.condition)}
                                    </Typography>
                                    <Divider orientation="vertical" flexItem />
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        sx={{
                                            border: 1,
                                            px: 2,
                                            borderRadius: "999px",
                                        }}
                                    >
                                        {product?.isLocal ? "Large" : "Small"}{" "}
                                        item
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Typography
                                        variant="subtitle2"
                                        color="initial"
                                    >
                                        Description:{" "}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        paragraph
                                    >
                                        {product?.description}
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Typography
                                        variant="subtitle2"
                                        color="initial"
                                    >
                                        Details:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        paragraph
                                    >
                                        {product?.details}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </section>
                    <Divider sx={{ my: 5 }} />

                    {/* Recommendations */}
                    <section>
                        {recommendations.length > 0 && (
                            <Stack>
                                <Typography
                                    variant="body1"
                                    color="secondary"
                                    gutterBottom
                                    sx={{ fontWeight: "bold" }}
                                >
                                    You may also like
                                </Typography>
                                <Box
                                    sx={{
                                        bgcolor: "#f0f0f0ff",
                                        p: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            overflowX: "auto",
                                            pb: 1,
                                            gap: 2,
                                            scrollBehavior: "smooth",
                                            height: "auto",
                                        }}
                                    >
                                        {recommendations.map((rec) => (
                                            <Box key={rec._id}>
                                                <ProductCartRecommendation
                                                    product={rec}
                                                    onNavigate={() => {
                                                        navigate(
                                                            `/product/${rec._id}`
                                                        );
                                                        window.scrollTo({
                                                            top: 0,
                                                            behavior: "smooth",
                                                        });
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Stack>
                        )}
                    </section>
                </Container>
            </Box>
            <Box sx={{ flex: 1, textAlign: "center" }}>
                <Dialog
                    open={imageOpen}
                    onClose={() => setImageOpen(false)}
                    maxWidth="lg"
                    PaperProps={{
                        sx: { bgcolor: "transparent", boxShadow: 0 },
                    }}
                >
                    <Box>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={0}
                            pagination={{ clickable: true }}
                            modules={[Pagination]}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                "--swiper-pagination-color": "white",
                                "--swiper-pagination-bullet-inactive-color":
                                    "#ccc",
                                "--swiper-pagination-bullet-size": "8px",
                            }}
                        >
                            {Array.isArray(product?.images) &&
                                product?.images.length > 0 &&
                                product?.images.map((img, idx) => (
                                    <SwiperSlide
                                        key={idx}
                                        style={{
                                            alignSelf: "center",
                                            position: "relative",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                justifySelf: "center",
                                                height: "100%",
                                                width: "100%",
                                            }}
                                        >
                                            <img
                                                src={`${img}`}
                                                alt={`${product?.productName}`}
                                                style={{
                                                    display: "block",
                                                    maxWidth: "100%",
                                                    height: "auto",
                                                }}
                                            />
                                        </Box>
                                        <IconButton
                                            onClick={() => setImageOpen(false)}
                                            sx={{
                                                position: "absolute",
                                                p: 0.5,
                                                bgcolor:
                                                    "rgba(255, 255, 255, 0.8)",
                                                top: 8,
                                                right: 8,
                                                zIndex: 10,
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </Box>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            backdropFilter: "blur(10px)",
                            zIndex: 100,
                            WebkitBackdropFilter: "blur(10px)",
                            borderRadius: 0.5,
                            px: 2,
                            py: 0.5,
                        }}
                    >
                        <Typography variant="body2" color="white">
                            {product?.productName}
                        </Typography>
                    </Box>
                </Dialog>
            </Box>

            <BottomActionBar>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={2}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/cart")}
                        sx={{
                            width: "100%",
                            flexGrow: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        View Cart
                        <ChevronRightIcon style={{ color: "white" }} />
                    </Button>
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={handleAddToCart}
                        sx={{ flexGrow: 1 }}
                    >
                        <ShoppingCartRoundedIcon />
                    </Button>
                </Stack>
            </BottomActionBar>
            <FullScreenLoader open={loading} />
        </Box>
    );
}
