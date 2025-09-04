import React from "react";
import { Box, Container, Stack, Typography, Link, Divider, TextField, Button, Grid } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook'
export default function UserFooter() {
    return (
        <Box sx={{ backgroundColor: "#f8f8f8", pt: 6, pb: 4, mt: 8 }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={4}
                    justifyContent="space-between"
                >
                    {/* About */}
                    <Box sx={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Kimm’s Furniture & Merchandise
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            We bring you the best of Japan’s surplus furniture and home goods, carefully selected for quality, style, and affordability. Each piece tells its own story and adds a unique touch to your living space.
                        </Typography>
                    </Box>
                        <Grid container spacing={0}>
                            <Grid size={{xs: 6}}>
                                    {/* Quick Links */}
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                            Quick Links
                                        </Typography>
                                        <Stack spacing={0.5}>
                                            <Link href="/" underline="hover">Home</Link>
                                            <Link href="/shop" underline="hover">Shop</Link>
                                            <Link href="/auction" underline="hover">Auctions</Link>
                                            <Link href="/contact" underline="hover">Contact</Link>
                                            <Link href="/faq" underline="hover">FAQ</Link>
                                        </Stack>
                                    </Box>
                            </Grid>
                            <Grid size={{xs: 6}}>
                                {/* Customer Service */}
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                            Help & Support
                                        </Typography>
                                        <Stack spacing={0.5}>
                                            <Link href="/shipping" underline="hover">Shipping & Returns</Link>
                                            <Link href="/payment" underline="hover">Payment Methods</Link>
                                            <Link href="/privacy" underline="hover">Privacy Policy</Link>
                                            <Link href="/terms" underline="hover">Terms & Conditions</Link>
                                        </Stack>
                                    </Box>
                            </Grid>
                        </Grid>

                    {/* Newsletter / Social */}
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Stay Updated
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Link href="#" underline="none" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <FacebookIcon/>
                                Facebook
                            </Link>
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ my: 4 }} />

                {/* Bottom */}
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    © 2025 Kimm’s Furniture & Merchandise. All rights reserved. Sourced from authentic Japan surplus stores.
                </Typography>
            </Container>
        </Box>
    );
}
