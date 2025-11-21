import React, { useEffect, useMemo, useState } from "react";
import {} from "@mui/icons-material";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import Chart from "../components/Charts/Chart";
import { InventoryContext } from "../../../../contexts/InventoryContext";
import { useContext } from "react";

const InventoryChart = () => {
    const { inventoryItems, allInventoryItems } = useContext(InventoryContext);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const filteredItems = useMemo(() => {
        if (selectedStatus === "all") return allInventoryItems;
        return allInventoryItems.filter(
            (item) => item.status === selectedStatus
        );
    }, [allInventoryItems, selectedStatus]);

    const chartData = useMemo(() => {
        const acc = {};
        filteredItems.forEach((item) => {
            const category = item.productId.split("-")[0]; // or item.category if exists

            if (!acc[category]) {
                acc[category] = {
                    category,
                    count: 0,
                    productName: [],
                };
            }
            // Increment count
            acc[category].count += 1;

            // Add product name
            acc[category].productName.push(item.productName);
        });
        return Object.values(acc);
    }, [filteredItems]);

    console.log("CHART DATA", chartData);
    const tableData = useMemo(() => {
        if (selectedCategory === "all") return filteredItems;
        return filteredItems.filter((item) =>
            item.productId.startsWith(selectedCategory)
        );
    }, [filteredItems, selectedCategory]);

    const statusTotals = useMemo(() => {
        const totals = {
            all: allInventoryItems.length,
            available: 0,
            reserve: 0,
        };

        allInventoryItems.forEach((item) => {
            if (item.status === "available" && item.status === 'available') totals.available += 1;
        });

        return totals;
    }, [allInventoryItems]);
    return (
        <Stack gap={2}>
            <Box sx={{ bgcolor: "#f8f8f8", borderRadius: 3, p: 2 }}>
                <Chart
                    onClick={(data) => setSelectedCategory(data.category)}
                    data={Array.isArray(chartData) ? chartData : []}
                />
            </Box>
        </Stack>
    );
};

export default InventoryChart;
