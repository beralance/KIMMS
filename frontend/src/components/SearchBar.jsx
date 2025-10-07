import { TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext"; // adjust path
import debounce from "lodash.debounce";

export default function SearchBar({ placeholder = "Search", height, onResults, sx, ...props }) {
    return (
        <Box sx={{ border: "none", borderRadius: "50%", margin: 1, }}>
            <TextField
                variant="outlined"
                placeholder={placeholder}
                type="search"
                sx={[
                    {
                        minWidth: "100%",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "999px",
                            px: ".5rem",
                            height: { height },
                            "& fieldset": {
                                borderColor: "grey",
                            },
                            "&:hover fieldset": {
                                borderColor: "grey",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "transparent",
                                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                    sx,
                ]}
                {...props}
            />
        </Box>
    );
}
