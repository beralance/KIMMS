import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";

export default function FilterDrawer({open, handleClose}) {

    return (
        <>
            {/* Button to open drawer */}
            <IconButton onClick={toggleDrawer} color="primary">
                <FilterList />
            </IconButton>

            {/* Drawer */}
            <Drawer anchor="right" open={open} onClose={toggleDrawer}>
                <Box sx={{ width: 300, p: 3 }}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Filters</Typography>
                    <Button onClick={toggleDrawer}>Close</Button>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Example Filter Sections */}

                {/* Category Filter */}
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                    Category
                    </Typography>
                    <FormControlLabel control={<Checkbox />} label="Sofa" />
                    <FormControlLabel control={<Checkbox />} label="Chair" />
                    <FormControlLabel control={<Checkbox />} label="Table" />
                </Box>

                {/* Price Filter */}
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                    Price
                    </Typography>
                    <Slider
                    defaultValue={[50, 500]}
                    min={0}
                    max={1000}
                    valueLabelDisplay="auto"
                    />
                </Box>

                {/* Availability Filter */}
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                    Availability
                    </Typography>
                    <FormControlLabel control={<Checkbox />} label="In Stock" />
                </Box>

                {/* Apply Button */}
                <Button variant="contained" fullWidth>
                    Apply Filters
                </Button>
                </Box>
            </Drawer>
        </>
    );
}
