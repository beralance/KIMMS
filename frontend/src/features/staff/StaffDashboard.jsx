import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Stack,
    ButtonGroup,
    Container,
} from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useReport } from "../../contexts/ReportContext";
import AdminHero from "../../features/admin/dashboard/components/AdminHero";
import BasicDataSection from "../../features/admin/dashboard/components/BasicDataSection";
import ChartSection from "../../features/admin/dashboard/components/ChartSection";
import OrdersSection from "../../features/admin/dashboard/components/OrdersSection";
import CardUpdates from "../../features/admin/dashboard/components/CardUpdates";
import SectionWrapper from "../../components/SectionWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { fetchStaffPermissions } from "../../utils/staffApi";
import CalendarWidget from "../../features/admin/dashboard/components/CalendarWidget";
import {
    CalendarPlusIcon,
    ChevronRightIcon,
    PackagePlusIcon,
    SquarePlusIcon,
} from "lucide-react";

const StaffDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        fetchReports,
        totalProducts,
        totalRevenue,
        liveAuctions,
        activeListings,
        newAddedItem,
        categoryBreakdown,
        recentlySold,
        pendingProducts,
        mostViewed,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        outForDeliveryOrders,
        newPostedProduct,
        inventoryItems,
        alerts,
        auctionOrders,
        fixedOrders,
        paidOrders,
        pendingPayments,
        totalOrders,
        conditionBreakdown,
    } = useReport();
    const [staffPerm, setStaffPerm] = useState([]);

    const goToAddInventory = () => {
        navigate("/staff/inventory/manage-inventory", {
            state: { openDialog: true },
        });
    };
    const goToPostProduct = () => {
        navigate("/staff/inventory/manage-product", {
            state: { openDialog: true },
        });
    };
    const goToCreateAuction = () => {
        navigate("/staff/inventory/manage-auction", {
            state: { openDialog: true },
        });
    };

    const categoryData = Object.entries(categoryBreakdown).map(
        ([name, value]) => ({
            name,
            value,
        })
    );

    const conditionData = Object.entries(conditionBreakdown).map(
        ([name, value]) => ({
            name,
            value,
        })
    );

    useEffect(() => {
        const staffPermission = async () => {
            if (!user || user.role !== "staff" || !user.userId) return;
            const permission = await fetchStaffPermissions(
                user.userId,
                user.token
            );
            setStaffPerm(permission);
            console.log("Permission", permission);
            console.log("Permission", user);
        };
        staffPermission();
    }, [user]);

    useEffect(() => {
        fetchReports({ period: "week" });
    }, []);

    useEffect(() => {
        console.log("staff", staffPerm);
    }, [staffPerm]);

    return (
        <Box sx={{ bgcolor: "#f0f0f0ff", height: "100%", minHeight: "95vh" }}>
            <Container>
                <Stack sx={{ mb: 3 }}>
                    <AdminHero />
                </Stack>
                <Stack sx={{ gap: 3 }}>
                    <SectionWrapper>
                        <CalendarWidget />
                    </SectionWrapper>
                    {/*QUICK actions*/}
                    {staffPerm.includes("inventory") && (
                        <SectionWrapper sx={{ gap: 2 }}>
                            <Stack>
                                <Typography variant="subtitle2" color="initial">
                                    Quick Actions
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Jump straight to adding items, posting
                                    products, or creating auctions
                                </Typography>
                            </Stack>
                            <Stack gap={1}>
                                {staffPerm.includes("inventory-management") && (
                                    <Stack>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="secondary"
                                            sx={{
                                                display: "flex",
                                                height: 70,
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                            onClick={goToAddInventory}
                                        >
                                            <Stack
                                                direction={"row"}
                                                alignItems={"center"}
                                                gap={2}
                                            >
                                                <PackagePlusIcon />
                                                Add Inventory
                                            </Stack>
                                            <ChevronRightIcon />
                                        </Button>
                                    </Stack>
                                )}
                                {staffPerm.includes("product-management") && (
                                    <Stack>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="secondary"
                                            sx={{
                                                display: "flex",
                                                height: 70,
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                            onClick={goToPostProduct}
                                        >
                                            <Stack
                                                direction={"row"}
                                                alignItems={"center"}
                                                gap={2}
                                            >
                                                <SquarePlusIcon />
                                                Post Product
                                            </Stack>
                                            <ChevronRightIcon />
                                        </Button>
                                    </Stack>
                                )}
                                {staffPerm.includes("auction-management") && (
                                    <Stack>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="secondary"
                                            sx={{
                                                display: "flex",
                                                height: 70,
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                            onClick={goToCreateAuction}
                                        >
                                            <Stack
                                                direction={"row"}
                                                alignItems={"center"}
                                                gap={2}
                                            >
                                                <CalendarPlusIcon />
                                                Create Auction
                                            </Stack>
                                            <ChevronRightIcon />
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </SectionWrapper>
                    )}

                    {/* BASIC data section*/}
                    <SectionWrapper sx={{ gap: 2 }}>
                        <Stack>
                            <Typography variant="subtitle2" color="initial">
                                Shop Overview
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Quick insights into sales, stock, and active
                                products
                            </Typography>
                        </Stack>
                        <BasicDataSection
                            totalProducts={totalProducts}
                            inventoryItems={inventoryItems}
                            totalOrders={totalOrders}
                            totalRevenue={totalRevenue}
                            liveAuctions={liveAuctions}
                            activeListings={activeListings}
                        />
                    </SectionWrapper>
                    {/* ORDER data section*/}

                    {staffPerm.includes("order") && (
                        <SectionWrapper sx={{ gap: 2 }}>
                            <Stack>
                                <Typography variant="subtitle2" color="initial">
                                    Orders Overview
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Track the total number of orders and their
                                    current progress
                                </Typography>
                            </Stack>
                            <OrdersSection
                                pendingOrders={pendingOrders}
                                confirmedOrders={confirmedOrders}
                                processingOrders={processingOrders}
                                outForDeliveryOrders={outForDeliveryOrders}
                                totalOrders={totalOrders}
                            />
                        </SectionWrapper>
                    )}
                    <Box>
                        <ChartSection
                            categoryData={categoryData}
                            conditionData={conditionData}
                            totalRevenue={totalRevenue}
                        />
                    </Box>
                    <SectionWrapper sx={{ gap: 2 }}>
                        <Stack>
                            <Typography variant="subtitle2" color="initial">
                                Most Viewed
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Items catching the most attention from shoppers
                                recently
                            </Typography>
                        </Stack>
                        <CardUpdates data={mostViewed} />
                    </SectionWrapper>
                    <SectionWrapper sx={{ gap: 2 }}>
                        <Stack>
                            <Typography variant="subtitle2" color="initial">
                                Recently Sold
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Products that have been recently purchased
                            </Typography>
                        </Stack>
                        <CardUpdates data={recentlySold} />
                    </SectionWrapper>
                    <SectionWrapper sx={{ gap: 2 }}>
                        <Stack>
                            <Typography variant="subtitle2" color="initial">
                                Newly Added in Inventory
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Latest product added inside inventory and ready
                                for sale
                            </Typography>
                        </Stack>
                        <CardUpdates data={newAddedItem} />
                    </SectionWrapper>
                    <SectionWrapper sx={{ gap: 2 }}>
                        <Stack>
                            <Typography variant="subtitle2" color="initial">
                                Newly Posted Products
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Latest products updloaded to the platform for
                                browsing
                            </Typography>
                        </Stack>
                        <CardUpdates data={newPostedProduct} />
                    </SectionWrapper>
                </Stack>
            </Container>
        </Box>
    );
};

export default StaffDashboard;
