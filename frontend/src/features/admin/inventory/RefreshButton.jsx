import React from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";

export default function RefreshButton({ 
    onRefresh, 
    loading = false, 
    size = "medium", 
    tooltip = "Refresh Data" ,
    sx
}) {
    return (
        <Tooltip title={tooltip}>
            <span>
                <IconButton 
                    onClick={onRefresh} 
                    size={size} 
                    disabled={loading}
                        sx={{
                            transition: "transform 0.2s",
                            "&:hover": { transform: "rotate(90deg)" },
                            ...sx
                        }}
                    >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <RefreshRounded />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
}
