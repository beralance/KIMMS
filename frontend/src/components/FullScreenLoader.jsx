// src/components/common/FullScreenLoader.jsx
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const FullScreenLoader = ({ open, message = "Loading..." }) => {
    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            open={open}
        >
        <CircularProgress color="inherit" />
            <Box>
                <Typography variant="body1">{message}</Typography>
            </Box>
        </Backdrop>
    );
};

export default FullScreenLoader;
