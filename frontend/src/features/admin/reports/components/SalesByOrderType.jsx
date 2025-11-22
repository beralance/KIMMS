import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Stack, Typography } from "@mui/material";

const SalesByOrderType = ({ fixedData, auctionData }) => {
    // Transform data into a single array for Recharts
    const chartData = [
        {
            name: "Total Sales",
            Fixed: fixedData[0]?.total || 0,
            Auction: auctionData[0]?.total || 0,
        },
    ];

    return (
        <Stack>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Fixed" fill="#1976d2" />
                    <Bar dataKey="Auction" fill="#ff9800" />
                </BarChart>
            </ResponsiveContainer>
        </Stack>
    );
};

export default SalesByOrderType;
