import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const DEFAULT_COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
];

const ReusablePieChart = ({
    data,
    dataKey,
    nameKey,
    title,
    colors = DEFAULT_COLORS,
    width = "100%",
    height = "100%",
}) => {
    return (
        <Box>
            <ResponsiveContainer width={"100%"} height={400}>
                <PieChart width={width} height={height}>
                    <Pie
                        dataKey={dataKey}
                        data={data}
                        nameKey={nameKey}
                        cx={"50%"}
                        cy={"50%"}
                        outerRadius={Math.min(width, height) / 3}
                        innerRadius={80}
                        fill="blue"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        layout="horizontal"
                    />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default ReusablePieChart;
