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
                        Reports and other stuff kase
                    </Typography>
                </Stack>
                <Stack
                    sx={{
                        position: "sticky",
                        top: 80,
                        zIndex: 1000,
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(20px)",
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
                    <Box>
                        <Typography variant="body1" color="initial">
                            Total Sales: Php {formatNumber(report.totalSales)}
                        </Typography>
                    </Box>
                    <Box>
                        {/*change to 10 users join the website*/}
                        <Typography variant="body1" color="initial">
                            New Users this {reportDate}: {report.newUsers}
                        </Typography>
                    </Box>
                </SectionWrapper>
                <SectionWrapper>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                Products by Category
                            </Typography>
                            <Typography variant="body2" color="gray">
                                cate cate this test test test
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
                                Sales this test test test
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
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                Local and International Users
                            </Typography>
                            <Typography variant="body2" color="gray">
                                cate cate this test test test
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
                                cate cate this test test test
                            </Typography>
                        </Stack>
                        <Stack gap={4}>
                            <Stack gap={2}>
                                <Typography variant="body1" color="initial">
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
                                <Typography variant="body1" color="initial">
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
                                <Typography variant="body1" color="initial">
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
                <SectionWrapper>
                    <TopSalesBasedOnCategory data={report.topCategorySales}/>
                </SectionWrapper>
            </Stack>
        </Box>
    );
};

export default Reports;
