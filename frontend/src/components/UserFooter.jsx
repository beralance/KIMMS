import React from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
    Link,
    Divider,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import {
    FileLockIcon,
    GavelIcon,
    HouseIcon,
    InfoIcon,
    ListTodoIcon,
    ShoppingBagIcon,
} from "lucide-react";
import { PhoneRounded } from "@mui/icons-material";

const quickLinks = [
    { icon: <HouseIcon />, path: "/", label: "Home" },
    { icon: <ShoppingBagIcon />, path: "/shop", label: "Shop" },
    { icon: <GavelIcon />, path: "/auction", label: "Auction" },
    { icon: <InfoIcon />, path: "/about-us", label: "About Us" },
];

const HnS = [
    { path: "/", label: "" },
    { path: "/", label: "" },
    { path: "/", label: "" },
    { path: "/", label: "" },
    { path: "/", label: "" },
];

export default function UserFooter() {
    return (
        <Box sx={{ pb: 4, bgcolor: "#fafafa" }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    justifyContent="space-between"
                >
                    {/* About */}
                    <Box
                        sx={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <img src="/kimms-logo.svg" style={{ width: "50px" }} />
                        <Stack alignItems={"center"}>
                            <Typography variant="h6">
                                Kimm’s Furniture & Merchandise
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Your trusted source for unique surplus finds
                            </Typography>
                        </Stack>
                    </Box>
                    {/* Quick Links */}
                    <Stack alignItems={"center"} gap={1}>
                        <Container>
                            <Divider sx={{ my: 2 }}>
                                <Typography variant="body2" color="gray">
                                    Quick Actions
                                </Typography>
                            </Divider>
                        </Container>
                        <Grid
                            container
                            spacing={2}
                            width={"100%"}
                            sx={{ justifyContent: "center" }}
                        >
                            {quickLinks.map((link, index) => (
                                <Grid key={index} size={{ xs: 6 }}>
                                    <Link href={link.path} underline="hover">
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                textDecoration: "underline",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Typography>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                    {/* Customer Service */}
                    <Stack alignItems={"center"}>
                        <Container>
                            <Divider sx={{ my: 2 }}>
                                <Typography variant="body2" color="gray">
                                    Help & Support
                                </Typography>
                            </Divider>
                        </Container>
                        <Stack gap={2}>
                            <Link
                                href={"/terms-and-conditions"}
                                underline="hover"
                            >
                                <Typography
                                    variant="body2"
                                    color="secondary"
                                    sx={{
                                        display: "flex",
                                        textDecoration: "underline",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <ListTodoIcon />
                                    Terms & Conditions
                                </Typography>
                            </Link>
                            <Link href={"/privacy-policy"} underline="hover">
                                <Typography
                                    variant="body2"
                                    color="secondary"
                                    sx={{
                                        display: "flex",
                                        textDecoration: "underline",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <FileLockIcon />
                                    Privacy Policy
                                </Typography>
                            </Link>
                        </Stack>
                    </Stack>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Container>
                            <Divider sx={{ my: 2 }}>
                                <Typography variant="body2" color="gray">
                                    Stay Updated
                                </Typography>
                            </Divider>
                        </Container>
                        <Stack spacing={1} alignItems={"center"}>
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
                            <Link
                                href="https://www.facebook.com/kimmsjapansurplus"
                                target="_blank"
                                underline="none"
                                sx={{
                                    display: "flex",
                                    color: "secondary.primary",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <FacebookIcon />
                                <Typography
                                    variant="body2"
                                    color="secondary"
                                    sx={{ textDecoration: "underline" }}
                                >
                                    Facebook
                                </Typography>
                            </Link>
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ my: 4 }} />

                {/* Bottom */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                >
                    © 2017 Kimm’s Furniture & Merchandise. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
