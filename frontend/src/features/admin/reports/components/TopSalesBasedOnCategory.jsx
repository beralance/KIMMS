import { Box, Stack, Grid } from "@mui/material";
import React from "react";

const TopSalesBasedOnCategory = ({ data }) => {
    return (
        <Box>
            <Stack>
                {data.map((category) => (
                    <Stack key={category._id}>
                        <Grid container spacing={0}>
                            <Grid size={{ xs: 12 }}></Grid>
                        </Grid>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
};

export default TopSalesBasedOnCategory;
