import React from "react";
import {
    Box,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
    Grid,
} from "@mui/material";
import { fetchFullReport } from "../../../utils/fullReportApi";
import { useState } from "react";
import FullScreenLoader from "../../../components/FullScreenLoader";
import SectionWrapper from "../../../components/SectionWrapper";
import { useEffect } from "react";
import { formatNumber } from "../../../utils/stringUtils";
import ReusablePieChart from "./components/ReusablePieChart";
import { SalesPerDayChart } from "./components/SalesPerDayChart";
import LocationBarChart from "./components/LocationBarChart";
import StockSizeBar from "./components/StockSizeBar";
import ReusableBarChart from "./components/ReusableBarChart";
import SalesBySizeGraph from "./components/SalesBySizeGraph";
import TopSalesBasedOnCategory from "./components/TopSalesBasedOnCategory";
import SalesByOrderType from "./components/SalesByOrderType";
import {
    BedRounded,
    CategoryRounded,
    HealingRounded,
} from "@mui/icons-material";

const Reports = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportDate, setReportDate] = useState("week");

    useEffect(() => {
        const getReport = async () => {
            try {
                const data = await fetchFullReport(reportDate);
                setReport(data);
                console.log("Report Data", data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getReport();
    }, [reportDate]);

    if (loading) return <FullScreenLoader open={loading} />;
    if (!report)
        return (
            <FullScreenLoader open={loading} message="Fetching Reports..." />
        );

    return (
        <Box sx={{ pb: 15, bgcolor: "#f0f0f0" }}>
            <Stack gap={2} p={2} position={"relative"}>
                <Stack>
                    <Typography variant="subtitle1" color="secondary">
                        Reports
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Track sales trends, user growth, and product analytics
                        over time
                    </Typography>
                </Stack>
                <Stack
                    sx={{
                        position: "sticky",
                        top: 80,
                        zIndex: 1000,
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(20px)",
                        p: 2,
                        py: 1.5,
                        borderRadius: 2,
                    }}
                >
                    <FormControl>
                        <InputLabel id="report-date-label">Range</InputLabel>
                        <Select
                            labelId="report-date-label"
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                            label="Range"
                        >
                            <MenuItem value="week">Week</MenuItem>
                            <MenuItem value="month">Month</MenuItem>
                            <MenuItem value="year">Year</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <SectionWrapper>
                    <Grid container spacing={1}>
                        <Grid size={{ xs: 6 }}>
                            <Stack
                                alignItems={"center"}
                                sx={{
                                    height: 150,
                                    bgcolor: "#7fbed6ff",
                                    p: 2,
                                    borderRadius: 2,
                                    justifyContent: "center",
                                }}
                            >
                                {/*change to 10 users join the website*/}
                                <Typography
                                    variant="h5"
                                    color="white"
                                    align="center"
                                >
                                    Php {formatNumber(report.totalSales)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="white"
                                    align="center"
                                >
                                    total sales this {reportDate}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Stack
                                alignItems={"center"}
                                sx={{
                                    height: 150,
                                    bgcolor: "#7f8fd6ff",
                                    p: 2,
                                    borderRadius: 2,
                                    justifyContent: "center",
                                }}
                            >
                                {/*change to 10 users join the website*/}
                                <Typography
                                    variant="h4"
                                    color="white"
                                    align="center"
                                >
                                    {report.newUsers}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="white"
                                    align="center"
                                >
                                    new users this {reportDate}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </SectionWrapper>
                <SectionWrapper>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                Products by Category
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Monitor the volume of products in each category.
                            </Typography>
                        </Stack>
                        <Box>
                            {report?.categoryPie?.length > 0 && (
                                <ReusablePieChart
                                    data={report?.categoryPie || {}}
                                    dataKey="count"
                                    nameKey="_id"
                                />
                            )}
                        </Box>
                    </Stack>
                </SectionWrapper>
                <SectionWrapper>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                Sales this {reportDate}
                            </Typography>
                            <Typography variant="body2" color="gray">
                                View total sales for the selected time period.
                            </Typography>
                        </Stack>
                        <Box>
                            {report?.salesPerDay?.length > 0 && (
                                <SalesPerDayChart
                                    salesPerDay={report.salesPerDay}
                                />
                            )}
                        </Box>
                    </Stack>
                </SectionWrapper>
                <SectionWrapper>
                    <Stack>
                        <Typography variant="body1" color="secondary">
                            Sales by Order Type
                        </Typography>
                        <Typography variant="body2" color="gray">
                            Compare total sales between fixed-price and auction
                            orders
                        </Typography>
                    </Stack>
                    <SalesByOrderType
                        fixedData={report?.fixedSales}
                        auctionData={report?.auctionSales}
                    />
                </SectionWrapper>
                <SectionWrapper>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                Local and International Users
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Distribution of users by local and international
                                regions
                            </Typography>
                        </Stack>
                        <LocationBarChart
                            data={[
                                {
                                    name: "International",
                                    value: Number(
                                        report.userLocation.international
                                    ),
                                },
                                {
                                    name: "Local",
                                    value: Number(
                                        report.userLocation.localPercent
                                    ),
                                },
                            ]}
                        />
                        <Stack>
                            <Typography
                                variant="body2"
                                color="gray"
                                fontWeight={"bold"}
                            >
                                NOTE:
                            </Typography>
                            <Typography variant="body2" color="gray">
                                <b>Local</b> users can view and purchase both
                                large and small products. <b>International</b>{" "}
                                users can only view and purchase small products.
                            </Typography>
                        </Stack>
                    </Stack>
                </SectionWrapper>
                <SectionWrapper>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                Small and Large Products
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Total count of posted product based on size
                                (small and large items)
                            </Typography>
                        </Stack>
                        <Box>
                            <StockSizeBar
                                data={report.stockSize.map((item) => ({
                                    name: item._id ? "Large" : "Small",
                                    value: item.count,
                                }))}
                            />
                        </Box>
                    </Stack>
                </SectionWrapper>

                <SectionWrapper>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                Sales by Category, Condition and Product Size
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Analyze sales distribution across product
                                categories, condition, and size over selected
                                time periods.
                            </Typography>
                        </Stack>
                        <Stack gap={4}>
                            <Stack gap={2}>
                                <Typography
                                    variant="body1"
                                    color="initial"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <CategoryRounded />
                                    Sales by Category
                                </Typography>
                                <ReusableBarChart
                                    data={report.salesByCategory}
                                    labelKey="_id"
                                    valueKey="sales"
                                />
                            </Stack>
                            <Divider />
                            <Stack gap={2}>
                                <Typography
                                    variant="body1"
                                    color="initial"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <HealingRounded />
                                    Sales by Condition
                                </Typography>
                                <ReusableBarChart
                                    data={report.salesByCondition}
                                    labelKey="_id"
                                    valueKey="sales"
                                />
                            </Stack>
                            <Divider />
                            <Stack gap={2}>
                                <Typography
                                    variant="body1"
                                    color="initial"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <BedRounded />
                                    Sales by Size-based
                                </Typography>

                                <SalesBySizeGraph data={report.salesBySize} />
                                <Stack>
                                    <Typography variant="body2" color="gray">
                                        <b>Small items</b> are products that are
                                        handled or shipped by logistics.{" "}
                                        <b>Large items</b> are mainly handled by
                                        own courier.
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </SectionWrapper>
                {/*
                <SectionWrapper>
                    <TopSalesBasedOnCategory data={report.topCategorySales}/>
                </SectionWrapper>
                */}
            </Stack>
        </Box>
    );
};

export default Reports;
