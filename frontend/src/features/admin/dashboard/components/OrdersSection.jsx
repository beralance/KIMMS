import React from "react";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import DataCard from "./DataCard";
import SectionWrapper from "../../../../components/SectionWrapper";

const OrderSection = ({
    outForDeliveryOrders,
    processingOrders,
    confirmedOrders,
    pendingOrders,
    totalOrders,
}) => {
    return (
        <>
            <Grid container spacing={1}>
                {[
                    {
                        label: "Total Orders",
                        value: totalOrders,
                        subLabel: "total orders",
                    },
                    {
                        label: "Pending Orders",
                        value: pendingOrders,
                        subLabel: "waiting for confirmation",
                    },
                    {
                        label: "Confirmed Orders",
                        value: confirmedOrders,
                        subLabel: "waiting to be processed",
                    },
                    {
                        label: "Processing Orders",
                        value: processingOrders,
                        subLabel: "on-going preparation",
                    },
                    {
                        label: "In Transit Orders",
                        value: outForDeliveryOrders,
                        subLabel: "on the way to customer",
                    },
                ].map((item, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                        <Box
                            sx={{
                                bgcolor: "#f0f0f0",
                                p: 2,
                                borderRadius: 2,
                                height: "100%",
                            }}
                        >
                            <DataCard
                                img={"/reports/deposit.svg"}
                                label={item.label}
                                value={item.value}
                                subLabel={item.subLabel}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default OrderSection;
