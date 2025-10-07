// src/components/productManagement/ManageProducts.jsx
import { useContext, useState } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  IconButton,
  Divider,
  CircularProgress
} from "@mui/material";
import { InventoryContext } from "../../../../contexts/InventoryContext";
import { ProductContext } from "../../../../contexts/ProductContext";
import { DoneAll, DoneAllRounded, RemoveDoneRounded } from "@mui/icons-material";
import RefreshButton from '../RefreshButton'

export default function ManageProducts() {
    const { inventoryItems, fetchInventoryItems } = useContext(InventoryContext);
    const { products, addProduct } = useContext(ProductContext);
    const [search, setSearch] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false)

    const availableInventory = inventoryItems.filter(
        (item) =>
            item.status === "available" &&
            !products.some((p) => p.inventoryId === item._id)
    );

    const filteredInventory = availableInventory.filter((item) => {
        const query = search.toLowerCase();
        return (
            item.productName.toLowerCase().includes(query) ||
            item.category?.name?.toLowerCase().includes(query) ||
            item.physicalCode.toLowerCase().includes(query) ||
            item.productId.toLowerCase().includes(query)
        );
    });

    // Toggle individual item
    const handleToggle = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Select / Deselect all
    const handleSelectAll = (checked) => {
        if (checked) {
            const allIds = filteredInventory.map((item) => item._id);
            setSelectedItems(allIds);
        } else {
            setSelectedItems([]);
        }
    };

    // Post selected items
    const handlePostSelected = async () => {
        for (const id of selectedItems) {
            setLoading(true)
            await addProduct(id);
        }
        setSelectedItems([]);
        setLoading(false)
        fetchInventoryItems(); // refresh inventory state
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await fetchInventoryItems();
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box>
            <TextField
                fullWidth
                margin="normal"
                label="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Typography variant="body2" color="grey" gutterBottom>
                * Posting will make the product/s visible to customer. Make sure the selected product is ready to be posted. 
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between', my: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{width: 120, justifyContent: 'center'}}
                    onClick={handlePostSelected}
                    disabled={selectedItems.length === 0}
                >
                    {loading ? 
                        <CircularProgress size={20} color="white"/>
                        :
                        'Post Selected'
                    }
                </Button>
                <RefreshButton onRefresh={handleRefresh} tooltip="Reload products"/>
            </Box>
            <Box sx={{pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box>
                    <Typography fontWeight={'bold'} color="secondary" variant="body1">
                        Available Items
                    </Typography>
                    <Typography variant="body2" color="grey">
                        Choose items from inventory to post in the store.
                    </Typography>
                </Box>
                <IconButton
                    sx={{ ml: 2, px: 3}}
                    onClick={() => {
                        if (selectedItems.length === filteredInventory.length) {
                            handleSelectAll(false);
                        } else {
                            handleSelectAll(true);
                        }
                    }}
                >
                    {selectedItems.length === filteredInventory.length
                        ? <RemoveDoneRounded/>
                        : <DoneAllRounded/>
                    }
                </IconButton>
            </Box>
            <List sx={{ height: 300, maxHeight: "50%", overflowY: "auto", bgcolor: '#f8f8f8', borderRadius: 2}}>
                {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                        <ListItem
                            key={item._id}
                            sx={{ display: "flex", justifyContent: "space-between" }}
                        >
                            <Stack direction={"row"} gap={2} alignItems={'center'}>
                                <img src={`${item.images[0]}`} style={{objectFit: 'cover',  aspectRatio: '1/1', borderRadius: 5, padding: 2, width: 80,  height: 80}}/>
                                <ListItemText
                                    primary={item.productName}
                                    secondary={`Category: ${item.category?.name} | Price: ₱${item.price}`}
                                />
                            </Stack>
                            <Checkbox
                                disabled={loading}
                                color="secondary"
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleToggle(item._id)}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Box>
                        <Typography variant="body2" color="textSecondary">
                            No available inventory found.
                        </Typography>
                    </Box>
                )}
            </List>
        </Box>
    );
}
