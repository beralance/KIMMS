import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { fetchPostedCategories, fetchCategoriesFromProducts } from "../../../utils/categoryApi";
import { useNavigate } from "react-router-dom";
import { CloseRounded } from "@mui/icons-material";

export default function ShopFilters({ sort, setSort, category, setCategory, categoryName, categoryId }) {
    const [categories, setCategories] = useState(["all"]);
    const navigate = useNavigate()
    // Fetch only posted categories from backend
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategoriesFromProducts();
                console.log('****THIS IS DATA CATEGORY ))))))', data)
                setCategories(["all", ...data.map((c) => ({ id: c.categoryId, name: c.name }))]);
                console.log('$$categories$$', categories)
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        loadCategories();
    }, []);
    return (
        <Box sx={{ mb: 2 }}>
            {/* Mobile: Select dropdowns */}
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 2, mb: 1 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="sort-label">Sort</InputLabel>
                    <Select
                        labelId="sort-label"
                        id="sort-select"
                        value={sort}
                        label="Sort"
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <MenuItem value="default">Default</MenuItem>
                        <MenuItem value="price-low-high">Price: Low → High</MenuItem>
                        <MenuItem value="price-high-low">Price: High → Low</MenuItem>
                    </Select>
                </FormControl>
                {!categoryId ? (
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((c, index) =>
                            c.id ? (
                                <MenuItem key={index} value={c.id}>
                                {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                                </MenuItem>
                            ) : (
                                <MenuItem key="all" value="all">
                                All
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>
                )
                :
                (
                    <Button 
                        variant="text" 
                        color="error" 
                        onClick={() => navigate('/shop')}
                        sx={{
                            display: 'flex',
                            gap: .5,
                            alignItems: 'center',
                        }}
                    >
                        {categoryName}
                        <CloseRounded fontSize="small"/>
                    </Button>
                )
            }
            </Box>

            {/* Desktop: List + Radio */}
            <Stack direction="column" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
                {/* Categories list */}
                <List sx={{ width: 150 }}>
                    <Typography variant="subtitle1" sx={{ pl: 2 }}>
                        Categories
                    </Typography>
                    {categories.map((c) =>
                        c.id ? (
                            <ListItemButton
                                key={c.id}
                                selected={category === c.id}
                                onClick={() => setCategory(c.id)}
                            >
                                <ListItemText primary={c.name.charAt(0).toUpperCase() + c.name.slice(1)} />
                            </ListItemButton>
                            ) : (
                            <ListItemButton
                                key="all"
                                selected={category === "all"}
                                onClick={() => setCategory("all")}
                            >
                                <ListItemText primary="All" />
                            </ListItemButton>
                        )
                    )}
                </List>

                {/* Sorting radio */}
                <FormControl>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Sort
                    </Typography>
                    <RadioGroup value={sort} onChange={(e) => setSort(e.target.value)}>
                        <FormControlLabel value="default" control={<Radio />} label="Default" />
                        <FormControlLabel value="price-low-high" control={<Radio />} label="Price: Low → High" />
                        <FormControlLabel value="price-high-low" control={<Radio />} label="Price: High → Low" />
                    </RadioGroup>
                </FormControl>
            </Stack>
        </Box>
    );
}
