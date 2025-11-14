import {
    Box,
    Button,
    IconButton,
    Stack,
    Typography,
    Grid,
    Collapse,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SectionWrapper from "../../components/SectionWrapper";
import { Link, useNavigate } from "react-router-dom";
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    MapPinIcon,
    PhoneIcon,
    PinIcon,
} from "lucide-react";
import ImageComponent from "./ImageComponent";
import { scrollToTop } from "../../utils/scroll";
import {
    EmailRounded,
    FacebookOutlined,
    FacebookRounded,
    LocationOnRounded,
    PhoneRounded,
} from "@mui/icons-material";
import { SwiperSlide, Swiper } from "swiper/react";
import { EffectCards } from "swiper/modules";

const reviews = [
    { image: "/kimmsAssets/reviews/review1.jpg" },
    { image: "/kimmsAssets/reviews/review2.jpg" },
    { image: "/kimmsAssets/reviews/review3.jpg" },
    { image: "/kimmsAssets/reviews/review4.jpg" },
    { image: "/kimmsAssets/reviews/review5.jpg" },
    { image: "/kimmsAssets/reviews/review6.jpg" },
];

const otherProducts = [
    { image: "/kimmsAssets/fig2.jpg" },
    { image: "/kimmsAssets/shoes.jpg" },
    { image: "/kimmsAssets/fig1.jpg" },
    { image: "/kimmsAssets/towel.jpg" },
    { image: "/kimmsAssets/vase2.jpg" },
    { image: "/kimmsAssets/vase.jpg" },
];

const AboutUs = () => {
    const navigate = useNavigate();
    const [productCat1, setProductCat1] = useState(true);
    const [productCat2, setProductCat2] = useState(false);
    const [productCat3, setProductCat3] = useState(false);
    const [productCat4, setProductCat4] = useState(false);

    useEffect(() => {
        scrollToTop();
    }, []);

    const handleToggle = (cat) => {
        if (cat === 1) {
            setProductCat1(!productCat1);
            setProductCat2(false);
            setProductCat3(false);
            setProductCat4(false);
        } else if (cat === 2) {
            setProductCat1(false);
            setProductCat2(!productCat2);
            setProductCat3(false);
            setProductCat4(false);
        } else if (cat === 3) {
            setProductCat1(false);
            setProductCat2(false);
            setProductCat3(!productCat3);
            setProductCat4(false);
        } else if (cat === 4) {
            setProductCat1(false);
            setProductCat2(false);
            setProductCat3(false);
            setProductCat4(!productCat4);
        }
    };
    return (
        <Stack sx={{ p: 2, bgcolor: "#f0f0f0" }}>
            <Stack gap={3}>
                <Stack>
                    <Typography variant="h5" color="secondary" align="center">
                        About Kimm's Furniture and Merchandise
                    </Typography>
                </Stack>
                <SectionWrapper sx={{ gap: 4 }}>
                    <Stack sx={{ gap: 1 }}>
                        <Typography variant="subtitle1" color="secondary">
                            The Heart of Kimm's
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid
                                size={{ xs: 6 }}
                                sx={{ overflowY: "auto", height: 250 }}
                            >
                                <Typography variant="body2" color="gray">
                                    To provide the people with quality
                                    Japan-made surplus products and household
                                    items that are durable, functional, and
                                    affordable. Kimm’s Furniture & Merchandise
                                    is dedicated to maintaining customer trust
                                    by offering dependable products that add
                                    comfort and value to every home.
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }} height={250}>
                                <img
                                    src="/kimmsAssets/figurine.jpg"
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack sx={{ gap: 1 }}>
                        <Typography variant="subtitle1" color="secondary">
                            The Future of Kimm's
                        </Typography>
                        <Grid container spacing={1} height={250}>
                            <Grid size={{ xs: 6 }} height={250}>
                                <img
                                    src="/kimmsAssets/truck.jpg"
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Grid>
                            <Grid
                                size={{ xs: 6 }}
                                sx={{ overflowY: "auto", height: 250 }}
                            >
                                <Typography variant="body2" color="gray">
                                    To continuously improve and expand Kimm’s
                                    Furniture & Merchandise, reaching more
                                    customers while maintaining the same
                                    standard of quality and service. The
                                    business aims to grow steadily beyond Tabaco
                                    City, offering a wider variety of Japan
                                    surplus goods to meet the needs of more
                                    households in the future.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                </SectionWrapper>
                <SectionWrapper>
                    <Stack gap={5}>
                        <Stack gap={1}>
                            <Typography variant="subtitle1" color="secondary">
                                Business Overview
                            </Typography>
                            <ImageComponent
                                img={"/kimmsAssets/KIMMS-Sign.jpg"}
                                alt={"kimms-shop-sign"}
                                width={"100%"}
                            />
                            <Typography variant="body2" color="gray">
                                Kimm’s Furniture & Merchandise is a trusted
                                surplus furniture store located in Tabaco City,
                                Albay, proudly owned and managed by Ms. Bella
                                Jane Celestial. Since its establishment in
                                August 2017, the business has been dedicated to
                                providing customers with quality surplus goods
                                and affordable household items, earning a strong
                                reputation for reliability and customer
                                satisfaction.
                            </Typography>
                        </Stack>
                        <Stack gap={1}>
                            <Typography variant="subtitle1" color="secondary">
                                Products and Services
                            </Typography>
                            <Typography variant="body2" color="gray">
                                The store offers a wide range of products across
                                various categories, including furniture,
                                appliances, kitchenware, storage solutions,
                                decorations, rattan products, electronics,
                                lighting fixtures, office equipment, cleaning
                                tools, outdoor and garden items, and other
                                essential household goods. Every item is
                                carefully sourced and inspected to ensure
                                quality, durability, and functionality.
                            </Typography>
                            <Stack gap={2} p={1}>
                                <Stack gap={1}>
                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                            fontWeight={"bold"}
                                        >
                                            Bags
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleToggle(1)}
                                        >
                                            {productCat1 ? (
                                                <ChevronUpIcon />
                                            ) : (
                                                <ChevronDownIcon />
                                            )}
                                        </IconButton>
                                    </Stack>
                                    <Collapse
                                        in={productCat1}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                        <Stack>
                                            <Grid container spacing={1}>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/bags-1.jpg"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/bags-3.jpg"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/bags-2.jpg"
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Collapse>
                                </Stack>

                                <Stack gap={1}>
                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                            fontWeight={"bold"}
                                        >
                                            Kitchenware
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleToggle(2)}
                                        >
                                            {productCat2 ? (
                                                <ChevronUpIcon />
                                            ) : (
                                                <ChevronDownIcon />
                                            )}
                                        </IconButton>
                                    </Stack>
                                    <Collapse
                                        in={productCat2}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                        <Stack>
                                            <Grid container spacing={1}>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/cups.jpg"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/cups-2.jpg"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/coffee-mugs.jpg"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/elegant-spoon-and-fork.jpg"
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Collapse>
                                </Stack>
                                <Stack gap={1}>
                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                            fontWeight={"bold"}
                                        >
                                            Furniture
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleToggle(3)}
                                        >
                                            {productCat3 ? (
                                                <ChevronUpIcon />
                                            ) : (
                                                <ChevronDownIcon />
                                            )}
                                        </IconButton>
                                    </Stack>
                                    <Collapse
                                        in={productCat3}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                        <Stack>
                                            <Grid container spacing={1}>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/cabinet.jpg"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <ImageComponent
                                                        height={250}
                                                        img={
                                                            "/kimmsAssets/green-sofa.jpg"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <ImageComponent
                                                        height={500}
                                                        img={
                                                            "/kimmsAssets/rattan-chair.jpg"
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Collapse>
                                </Stack>
                                <Stack gap={1}>
                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                            fontWeight={"bold"}
                                        >
                                            Others
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleToggle(4)}
                                        >
                                            {productCat4 ? (
                                                <ChevronUpIcon />
                                            ) : (
                                                <ChevronDownIcon />
                                            )}
                                        </IconButton>
                                    </Stack>
                                    <Collapse
                                        in={productCat4}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                        <Stack>
                                            <Grid container spacing={1}>
                                                {otherProducts.map(
                                                    (o, index) => (
                                                        <Grid
                                                            key={index}
                                                            size={{ xs: 6 }}
                                                        >
                                                            <ImageComponent
                                                                height={220}
                                                                img={o.image}
                                                            />
                                                        </Grid>
                                                    )
                                                )}
                                            </Grid>
                                        </Stack>
                                    </Collapse>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack gap={1}>
                            <Typography variant="subtitle1" color="secondary">
                                Location and Product Sourcing
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Located at Berces St., Zone 1, Baranghawon,
                                Tabaco City, Kimm’s Furniture & Merchandise
                                takes pride in its diverse selection of Japan
                                surplus products, offering customers unique and
                                high-quality items suitable for every home. Each
                                shipment is thoroughly curated to guarantee
                                authenticity and excellent condition, with the
                                store continually updating its product lineup to
                                provide fresh, dependable, and well-crafted
                                goods that meet customer needs and preferences.
                            </Typography>
                        </Stack>
                        <Stack gap={2}>
                            <Stack gap={1}>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Get in Touch
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Have questions or want to visit our store?
                                    We’re here to help! Contact us via phone or
                                    email, or drop by Kimm’s Furniture &
                                    Merchandise in Tabaco City. Click the map
                                    link below to get directions straight to our
                                    location
                                </Typography>
                            </Stack>
                            <Stack gap={1} position={"relative"}>
                                <Typography
                                    variant="body2"
                                    color="gray"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <PhoneRounded />
                                    0995 937 2422
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="gray"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <EmailRounded />
                                    kimmsfurnituresinquiry@gmail.com
                                </Typography>
                                <Link
                                    to={
                                        "https://www.facebook.com/kimmsjapansurplus"
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: "gray",
                                    }}
                                >
                                    <FacebookRounded />
                                    <Typography variant="body2" color="gray">
                                        Kimm's Furniture and Merchandise
                                    </Typography>
                                </Link>
                                <Link
                                    target="_blank"
                                    style={{
                                        color: "gray",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                    to={
                                        "https://maps.app.goo.gl/9aedRrBdvqxC33fK7"
                                    }
                                >
                                    <LocationOnRounded
                                        style={{ color: "gray" }}
                                    />
                                    <Typography variant="body2" color="gray">
                                        Berces St. Zone 1 Baranghawon , Tabaco,
                                        Philippines
                                    </Typography>
                                </Link>
                                <Stack gap={1} position={"relative"}>
                                    <ImageComponent
                                        img={
                                            "/kimmsAssets/Kimms-Shop-Location-Map.png"
                                        }
                                    />
                                    <Link
                                        target="_blank"
                                        style={{
                                            color: "gray",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            backdropFilter: "blur(10px)",
                                            borderRadius: "5px",
                                            paddingInline: "5px",
                                            position: "absolute",
                                            bottom: 5,
                                            left: 5,
                                            alignSelf: "center",
                                        }}
                                        to={
                                            "https://maps.app.goo.gl/9aedRrBdvqxC33fK7"
                                        }
                                    >
                                        <MapPinIcon style={{ color: "gray" }} />
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Berces St. Zone 1 Baranghawon ,
                                            Tabaco, Philippines
                                        </Typography>
                                    </Link>
                                </Stack>
                            </Stack>
                            <Stack gap={1}>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Proof of Authenticity
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    The following public posts and updates serve
                                    as proof of authenticity for Kimm’s
                                    Furniture & Merchandise. They verify the
                                    store’s legitimacy and highlight real
                                    interactions with our customers.
                                </Typography>
                                <Grid container spacing={1}>
                                    {reviews.map((r, index) => (
                                        <Grid
                                            size={{ xs: 6 }}
                                            key={index}
                                            sx={{
                                                boxShadow: 2,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <ImageComponent img={r.image} />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Stack>
                                    <Link
                                        target="_blank"
                                        style={{
                                            color: "gray",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            alignSelf: "flex-end",
                                        }}
                                        to={
                                            "https://www.facebook.com/media/set/?set=a.1024655752998304&type=3"
                                        }
                                    >
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            View all reviews on Facebook
                                        </Typography>
                                    </Link>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </SectionWrapper>
            </Stack>
        </Stack>
    );
};

export default AboutUs;
