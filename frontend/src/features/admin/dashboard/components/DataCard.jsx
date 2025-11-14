import { Box, Divider, Stack, Typography } from "@mui/material";
import { ChevronRightIcon, PlayIcon } from "lucide-react";
import React from "react";

const DataCard = ({ subLabel, img, label, value, icon }) => {
    return (
        <Box sx={{ width: "100%", borderRadius: 2 }}>
            <Stack p={1} alignItems={"center"} justifyContent={"center"}>
                <Typography variant="h4" color="primary" align="center">
                    {value}
                </Typography>
                <Typography
                    variant="body2"
                    color="gray"
                    fontWeight={"bold"}
                    align="center"
                >
                    {subLabel}
                </Typography>
            </Stack>
        </Box>
    );
};

export default DataCard;
