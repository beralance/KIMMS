import React from "react";
import { Box, Stack } from "@mui/material";

const SectionWrapper = ({ children, sx, ...props }) => {
    return (
        <Box>
            <Stack
                {...props}
                sx={{ p: 2, bgcolor: "white", borderRadius: 2, ...sx }}
            >
                {children}
            </Stack>
        </Box>
    );
};

export default SectionWrapper;
