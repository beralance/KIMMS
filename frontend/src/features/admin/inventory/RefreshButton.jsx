import React from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";

/**
 * Reusable refresh button component.
 * 
 * Props:
 * - onRefresh: function to call when clicked (required)
 * - loading: boolean to show loading spinner (optional)
 * - size: 'small' | 'medium' | 'large' (optional)
 * - tooltip: string to show on hover (optional)
 */
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
