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
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }} height={250}>
                                <img
                                    src="/background01.jpg"
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
                                    src="/background01.jpg"
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
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
                                img={"/background01.jpg"}
                                alt={"kimms-shop-sign"}
                                width={"100%"}
                            />
                            <Typography variant="body2" color="gray">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
                                ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
                                in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
                                officia deserunt mollit anim id est laborum.
                            </Typography>
                        </Stack>
                        <Stack gap={1}>
                            <Typography variant="subtitle1" color="secondary">
                                Products and Services
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae 
                                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur 
                                aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, 
                                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam 
                                aliquam quaerat voluptatem.
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
                                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis 
                                suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? 
                                Quis autem vel eum iure reprehenderit qui in ea voluptate velit 
                                esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo 
                                voluptas nulla pariatur?
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
                                    email, or drop by. Click the map
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
                                    091 234 5678
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
                                    sample-email-address@sample.com
                                </Typography>
                                <Link
                                    to={
                                        "https://"
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
                                        "https://"
                                    }
                                >
                                    <LocationOnRounded
                                        style={{ color: "gray" }}
                                    />
                                    <Typography variant="body2" color="gray">
                                        Sample Location, Philippines
                                    </Typography>
                                </Link>
                                <Stack gap={1} position={"relative"}>
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
                                    >
                                        <MapPinIcon style={{ color: "gray" }} />
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Sample Location, Philippines
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
                            </Stack>
                        </Stack>
                    </Stack>
                </SectionWrapper>
            </Stack>
        </Stack>
    );
};

export default AboutUs;
