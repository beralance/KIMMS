// src/features/admin/components/OrderSearch.jsx
import React, { useContext, useState } from "react";
import { TextField } from "@mui/material";
import { OrderContext } from "../../../contexts/OrderContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";

export default function OrderSearch({ searchTerm, setSearchTerm, onSearch, error }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch()
        }
    }

    return (
        <TextField
            fullWidth
            label="Search Order ID..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            error={!!error}
            helperText={error || ''}
            sx={{ mb: 2 }}
        />
    );
}
