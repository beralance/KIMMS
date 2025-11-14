import { Box, Button, Container, Divider, Typography } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRightRounded } from "@mui/icons-material";
import { ChevronRightIcon, LayoutDashboardIcon, StoreIcon } from "lucide-react";

const UserLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Box>
            <header>
                <UserHeader />
            </header>

            <main>
                {user && (user.role === "admin" || user.role === "staff") && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 10,
                            right: 0,
                        }}
                    >
                        <Button
                            variant="text"
                            sx={{
                                borderRadius: "999px",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                position: "fixed",
                                bottom: 20,
                                right: 10,
                                backdropFilter: "blur(10px)",
                                bgcolor: "rgba(0, 0, 0, 0.5)",
                                px: 2,
                                color: "white",
                                textDecoration: "underline",
                                zIndex: 1000,
                            }}
                            onClick={() =>
                                navigate(
                                    (user.role === "admin" && "/admin") ||
                                        (user.role === "staff" && "/staff")
                                )
                            }
                        >
                            Go to Dashboard
                            <LayoutDashboardIcon
                                style={{ color: "white", fill: "white" }}
                            />
                        </Button>
                    </Box>
                )}
                <Box sx={{ m: 0, mt: { xs: "56px", sm: "64px" } }}>
                    <Outlet />
                </Box>
            </main>
            <Container sx={{ bgcolor: "#fafafa" }}>
                <Divider sx={{ py: 10 }}>
                    <img
                        src="/sofa.svg"
                        style={{
                            width: "30px",
                            opacity: ".8",
                            marginInline: "15px",
                        }}
                    />
                </Divider>
            </Container>
            <footer>
                <UserFooter />
            </footer>
        </Box>
    );
};

export default UserLayout;
