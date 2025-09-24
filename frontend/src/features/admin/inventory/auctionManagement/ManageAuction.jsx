import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Select,
    InputLabel,
    FormControl,
    FormHelperText
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

const ManageAuction = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [startPrice, setStartPrice] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reservePrice, setReservePrice] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const { token } = useAuth()
    const [loading, setLoading] = useState(false)
    const [fixedAmount, setFixedAmount] = useState(0)

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/inventory");
                setInventoryItems(res.data.filter(item => item.status === "available"));
            } catch (err) {
                console.error(err);
            }
        };
        fetchInventory();
    }, []);

    const validate = () => {
        const errs = {};
        if (!selectedItem) errs.selectedItem = "Select an inventory item.";
        if (!startPrice || startPrice <= 0) errs.startPrice = "Starting price must be greater than 0.";
        if (!reservePrice || reservePrice <= 0) errs.reservePrice = "Reserve price must be greater than 0.";
        if (!startTime) errs.startTime = "Start time is required.";
        if (!endTime) errs.endTime = "End time is required.";
        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) errs.endTime = "End time must be after start time.";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        try {
            setLoading(true)
            await axios.post(
                "http://localhost:5000/api/auctions",
                {
                    inventoryId: selectedItem,
                    startPrice: parseFloat(startPrice),
                    startTime,
                    endTime,
                    reservePrice: parseFloat(reservePrice),
                    description,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Auction created successfully!");
            setSelectedItem("");
            setStartPrice("");
            setStartTime("");
            setEndTime("");
            setReservePrice("");
            setDescription("");
            setErrors({});
        } catch (err) {
            console.error("Auction create error:", err);
            setMessage(err.response?.data?.message || "Failed to create auction");
        }
        finally {
            setLoading(false);
        }
    };

    const minDateTime = new Date().toISOString().slice(0, 16);

    return (
        <Box sx={{mx: "auto"}}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" error={!!errors.selectedItem}>
                    <InputLabel id="inventory-label">Inventory Item</InputLabel>
                    <Select
                        labelId="inventory-label"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        {inventoryItems.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.productName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.selectedItem && <FormHelperText>{errors.selectedItem}</FormHelperText>}
                </FormControl>

                <TextField
                    label="Starting Price"
                    type="number"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!errors.startPrice}
                    helperText={errors.startPrice}
                />

                <TextField
                    label="Reserve Price"
                    type="number"
                    value={reservePrice}
                    onChange={(e) => setReservePrice(e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!errors.reservePrice}
                    helperText={errors.reservePrice}
                />

                <TextField
                    label="Start Time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: minDateTime }}
                    error={!!errors.startTime}
                    helperText={errors.startTime}
                />

                <TextField
                    label="End Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: minDateTime }}
                    error={!!errors.endTime}
                    helperText={errors.endTime}
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Auction'}
                    </Button>
                </Box>
            </form>

            {message && (
                <Typography sx={{ mt: 2 }} color={message.includes("successfully") ? "green" : "red"}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default ManageAuction;
