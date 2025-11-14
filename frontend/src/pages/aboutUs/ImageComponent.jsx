import { Box } from "@mui/material";
import React from "react";

const ImageComponent = ({ width, height, radius = 5, img, alt, sx }) => {
    return (
        <Box width={width} height={height}>
            <img
                src={img}
                alt={alt}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: radius,
                    ...sx,
                }}
            />
        </Box>
    );
};

export default ImageComponent;
