import React from "react";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import SectionWrapper from "../../../../components/SectionWrapper";
import { Radar } from "lucide-react";

const ChartSection = ({ categoryData, totalRevenue, conditionData }) => {
    const categoryColors = [
        "#4a90e2",
        "#50e3c2",
        "#f5a623",
        "#d0021b",
        "#9013fe",
        "#f8e71c",
        "#7ed321",
        "#bd10e0",
        "#8b572a",
    ];

    const conditionColors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2"];

    console.log("LKAJSFLKJSLDKAJFasldfj", totalRevenue);
    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <SectionWrapper>
                        <Stack height={400}>
                            <Typography variant="subtitle2" mb={2}>
                                Revenue Overview
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        {
                                            name: "Total",
                                            revenue: totalRevenue,
                                        },
                                    ]}
                                >
                                    <YAxis
                                        tickFormatter={(value) => `₱${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => `₱${value}`}
                                    />
                                    <YAxis />
                                    <Bar dataKey="revenue" fill="#1976d2" />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </Stack>
                    </SectionWrapper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <SectionWrapper>
                        <Stack height={400}>
                            <Typography variant="subtitle2" mb={2}>
                                Category Breakdown
                            </Typography>
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        label
                                        outerRadius={80}
                                        innerRadius={50}
                                    >
                                        {categoryData?.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    categoryColors[
                                                        index %
                                                            categoryColors.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        verticalAlign="bottom"
                                        layout="horizontal"
                                        align="start"
                                        wrapperStyle={{
                                            overflowX: "auto",
                                            display: "flex",
                                            width: "100%",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Stack>
                    </SectionWrapper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <SectionWrapper>
                        <Stack height={400}>
                            <Typography variant="subtitle2" mb={2}>
                                Condition Breakdown
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={conditionData}
                                        dataKey="value"
                                        nameKey="name"
                                        label
                                        outerRadius={80}
                                        innerRadius={50}
                                    >
                                        {conditionData?.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    conditionColors[
                                                        index %
                                                            conditionColors.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        verticalAlign="bottom"
                                        layout="horizontal"
                                        align="start"
                                        wrapperStyle={{
                                            overflowX: "auto",
                                            display: "flex",
                                            width: "100%",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Stack>
                    </SectionWrapper>
                </Grid>
            </Grid>
        </>
    );
};

export default ChartSection;
