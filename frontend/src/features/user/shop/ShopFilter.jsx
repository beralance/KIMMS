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
  Drawer,
  IconButton,
  Divider,
  ListItem,
  Checkbox,
  Container,
} from "@mui/material";
import { fetchPostedCategories, fetchCategoriesFromProducts } from "../../../utils/categoryApi";
import { useNavigate } from "react-router-dom";
import { CloseRounded } from "@mui/icons-material";
import { ArrowDown01Icon, ArrowUpDownIcon, BlocksIcon, ChartColumnStacked, ChartColumnStackedIcon, FilterIcon, FunnelIcon, XIcon } from "lucide-react";
import SectionWrapper from "../../../components/SectionWrapper";

export default function ShopFilters({ sort, setSort, filteredProducts, category, setCategory, categoryName, categoryId }) {
    const [categories, setCategories] = useState(["all"]);
    const [openDrawer, setOpenDrawer] = useState(false)

    const handleDrawerOpen = () => setOpenDrawer(true)
    const handleDrawerClose = () => setOpenDrawer(false)

    const navigate = useNavigate()


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategoriesFromProducts();
                setCategories(['all', ...data.map((c) => ({ id: c.categoryId, name: c.name }))]);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        loadCategories();
    }, []);

    const selectedCategory = categories.find((c) => c.id === category) || {name: 'All'}

    return (

        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 2, mb: 1 }}>
                <Stack gap={1} width={'100%'}>
                    
                    <Stack gap={1} direction={'row'} flexWrap={'wrap'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                        <Typography variant="body2" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            {`Product${filteredProducts.length > 1 ? 's' : ''} (${filteredProducts.length})`}
                        </Typography>
                        <Stack direction={'row'} gap={1}>
                            {categoryId ?
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
                                :
                                <Box sx={{ display: { xs: "flex", md: "none" }, }}>
                                    <Button onClick={handleDrawerOpen} variant="contained" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <FilterIcon style={{color: 'white'}}/>
                                        <Typography variant="body2" color="white">{selectedCategory.name}</Typography>
                                    </Button>
                                </Box>
                            }
                        </Stack>
                    </Stack>
                </Stack>

                <Drawer anchor="left" open={openDrawer} onClose={handleDrawerClose}>
                    <IconButton onClick={handleDrawerClose} sx={{position: 'absolute', top: 5, right: 5}}>
                        <XIcon/>
                    </IconButton>
                    <Container sx={{height: '100%'}}>
                        <Stack sx={{ width: 300, height: '100%', py: 2}}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" sx={{display: 'flex', alignItems: 'center', gap: 1, py: 1}}>
                                    <FunnelIcon/>
                                    Filters
                                </Typography>
                            </Stack>
                            <Divider sx={{my: 2}}/>
                            <Stack gap={2} sx={{maxHeight: '90vh', p: 1, overflowY: 'auto',}}>
                                {/*Price filter*/}
                                <SectionWrapper sx={{bgcolor: '#f0f0f0'}}>
                                    <Box mb={3}>
                                        <Typography variant="subtitle2" fontWeight={'bold'} color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <ArrowUpDownIcon/>
                                            Sort
                                        </Typography>
                                        <RadioGroup
                                            sx={{p: 1}}
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value)}
                                        >
                                            <FormControlLabel
                                                value="default"
                                                control={<Radio color="secondary"/>}
                                                label="Default"
                                            />
                                            <FormControlLabel
                                                value="price-low-high"
                                                control={<Radio color="secondary" />}
                                                label="Low → High"
                                            />
                                            <FormControlLabel
                                                value="price-high-low"
                                                control={<Radio color="secondary" />}
                                                label="High → Low"
                                            />
                                        </RadioGroup>
                                    </Box>
                                </SectionWrapper>

                                {/*Category Filter, hide if shop is filtered using home*/}
                                <SectionWrapper sx={{bgcolor: '#f0f0f0'}}>
                                    <Box>
                                        <Typography variant="subtitle2"  fontWeight={'bold'} color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <ChartColumnStackedIcon/>
                                            Category
                                        </Typography>
                                        {!categoryId ? (
                                            <List sx={{p: 1}}>
                                                <RadioGroup
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                >
                                                    <FormControlLabel value="all" control={<Radio color="secondary"/>} label="All" />
                                                    {categories
                                                        .filter((c) => c.id)
                                                        .map((c) => (
                                                        <FormControlLabel
                                                            key={c.id}
                                                            value={c.id}
                                                            control={<Radio color="secondary" />}
                                                            label={typeof c.name === 'string' ? c.name.charAt(0).toUpperCase() + c.name.slice(1) : JSON.stringify(c.name)}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </List>
                                        ) : (
                                            <Box sx={{mt: 2}}>
                                                <Button 
                                                    variant="outlined" 
                                                    color="error" 
                                                    fullWidth
                                                    onClick={() => navigate('/shop')}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        py: 1,
                                                        my: 1,
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {categoryName}
                                                    <CloseRounded fontSize="small"/>
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </SectionWrapper>
                            </Stack>
                        </Stack>
                    </Container>
                </Drawer>
            </Box>

            <Stack direction="column" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
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
