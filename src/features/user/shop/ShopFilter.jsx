import React from "react";
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
} from "@mui/material";

export default function ShopFilters({ sort, setSort, category, setCategory }) {
  const categories = ["all", "cabinet", "sofa", "bed"];

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

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Desktop: List + Radio */}
      <Stack
        direction="column"
        spacing={4}
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        {/* Categories list */}
        <List sx={{ width: 150 }}>
          <Typography variant="subtitle1" sx={{ pl: 2 }}>
            Categories
          </Typography>
          {categories.map((c) => (
            <ListItemButton
              key={c}
              selected={category === c}
              onClick={() => setCategory(c)}
            >
              <ListItemText
                primary={c.charAt(0).toUpperCase() + c.slice(1)}
              />
            </ListItemButton>
          ))}
        </List>

        {/* Sorting radio */}
        <FormControl>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Sort
          </Typography>
          <RadioGroup
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <FormControlLabel value="default" control={<Radio />} label="Default" />
            <FormControlLabel
              value="price-low-high"
              control={<Radio />}
              label="Price: Low → High"
            />
            <FormControlLabel
              value="price-high-low"
              control={<Radio />}
              label="Price: High → Low"
            />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Box>
  );
}
