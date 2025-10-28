import React, { useState, useEffect, use } from "react";
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    Stack,
    Divider
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";
import { toTitleCase } from "../../../../utils/stringUtils";
import { Category, ChevronRightRounded } from "@mui/icons-material";
import {useSnackbar} from '../../../../contexts/SnackbarContext'
import { InventoryContext } from "../../../../contexts/InventoryContext";
import { useContext } from "react";

const ManageAuction = () => {
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
    const [duration, setDuration] = useState('')
    const [search, setSearch] = useState('')
    const {showSnackbar} = useSnackbar()
    const { inventoryItems, fetchInventoryItems} = useContext(InventoryContext)
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime)

            if (end > start) {
                const diffMs = end - start;
                const diffHours = diffMs / (1000 * 60 * 60)
                const days = Math.floor(diffHours / 24);
                const hours = Math.floor(diffHours % 24)
                const minutes = Math.round((diffHours * 60) % 60)

                let durationStr = ''
                if (days > 0) durationStr += `${days} day${days > 1 ? 's ' : ' '}`
                if (hours > 0) durationStr += `${hours} hour${hours > 1 ? 's ' : ' '}`
                if (minutes > 0) durationStr += `${minutes} min${minutes > 1 ? 's ' : ' '}`
                
                setDuration(durationStr.trim())
            }
            else {
                setDuration('')
            }
        }
        else {
            setDuration('')
        }
    }, [startTime, endTime])
    
    useEffect(() => {
        fetchInventoryItems()
    }, [])
    
    useEffect(() => {
        if (selectedItem) {
            const item = inventoryItems.find(i => i._id === selectedItem);
            if(item) {
                setStartPrice(item.price)
            }
        }
    }, [selectedItem, inventoryItems])
    
    const filteredInventory = inventoryItems.filter((item) => {

    const query = search.toLowerCase();
        return (
            item.productName.toLowerCase().includes(query) ||
            item.category?.name?.toLowerCase().includes(query) ||
            item.physicalCode?.toLowerCase().includes(query) ||
            item.productId?.toLowerCase().includes(query)
        );
    });

    const validate = () => {
        const errs = {};    
        const now = new Date();
        const fiveMinFromNow = new Date(now.getTime() + 1 * 60 * 1000); // change to 5 min
        const minDurationMs = 1 * 60 * 1000; // change to 1 hour
        const maxDurationMs = 7 * 24 * 60 * 60 * 1000; // 7 days

        if (!selectedItem) errs.selectedItem = "Select an inventory item.";
        if (!startPrice || startPrice <= 0) errs.startPrice = "Starting price must be greater than 0.";
        if (!reservePrice || reservePrice <= 0) {
            errs.reservePrice = "Reserve price must be greater than 0.";
        } else if (reservePrice < startPrice) {
            errs.reservePrice = `Reserve price must be at least Php ${startPrice}`;
        }

        if (!startTime) errs.startTime = "Start time is required.";
        if (!endTime) errs.endTime = "End time is required.";

        if (startTime && new Date(startTime) < new Date())
            errs.startTime = "Start time cannot be in the past.";

        if (startTime && new Date(startTime) < fiveMinFromNow)
            errs.startTime = "Start time must be at least 5 minutes from now.";

        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const duration = end - start;

            if (start >= end) {
                errs.endTime = "End time must be after start time.";
            } else if (duration < minDurationMs) {
                errs.endTime = "Auction duration must be at least 1 hour.";
            } else if (duration > maxDurationMs) {
                errs.endTime = "Auction duration cannot exceed 7 days.";
            }
        }

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
                `${API_URL}/api/auctions`,
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

            showSnackbar("Auction created successfully!", 'success');
            
            await fetchInventoryItems()

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
            <Stack direction={'row'} alignItems={'center'} gap={2} sx={{m: 2}}>
                <img src="/time.svg" alt="time" style={{width: 50, opacity: .8}}/>
                <Box>
                    <Typography variant="body2" color="grey">
                        "Fill in the item details to include them in the auction list. Complete and clear information helps attract more bidders."
                    </Typography>
                </Box>
            </Stack>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" error={!!errors.selectedItem} >
                    <InputLabel id="inventory-label">Inventory Item</InputLabel>
                    <Select
                        MenuProps={{
                            MenuListProps: {
                                sx: {
                                    paddingTop: 2,
                                }
                            }
                        }}
                        labelId="inventory-label"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        {filteredInventory.length > 0 ? (
                            filteredInventory.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    <Stack direction={'row'} alignItems={'center'} gap={2} width={'100%'} sx={{pr: 2}}>
                                        <img 
                                            src={`${item.images[0]}`} 
                                            alt={item.productName} 
                                            style={{
                                                aspectRatio: '1/1', 
                                                borderRadius: 5, 
                                                width: 80, 
                                                height: 80,
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <Stack width={'100%'}>
                                            <Typography variant="body1" color="initial">
                                                {item.productName}
                                            </Typography>
                                            <Divider/>
                                            <Typography variant="body2" noWrap maxWidth={200} color="grey">
                                                {`Php ${item.price} | ${item.isLocal ? 'Local' : 'international'}`}
                                            </Typography>
                                            <Typography variant="body2" color="grey">
                                                {`${item.category?.name} | ${item.condition}`}
                                            </Typography>
                                        </Stack>

                                    </Stack>
                                </MenuItem>
                                )))
                                :
                                (
                                    <MenuItem disabled>
                                        <Stack sx={{width: '100%', my: 2}} justifyContent={'center'} alignItems={'center'}>
                                            <img src="/emoji-sick-svgrepo-com.svg" alt="emoji-sick" style={{width: 50}}/>
                                            <Typography variant="body2" color="initial">
                                                No Items found
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                )
                            }
                    </Select>
                    {errors.selectedItem && <FormHelperText>{errors.selectedItem}</FormHelperText>}
                </FormControl>

                <Typography variant="body2" color="grey">
                    * The starting price for the auction item will be set based on its current inventory price.
                </Typography>
                <TextField
                    label="Starting Price"
                    type="number"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!errors.startPrice}
                    helperText={errors.startPrice}
                    InputProps={{readOnly: true}}
                />
                <Typography variant="body2" color="grey">
                    * The reserve price sets the minimum acceptable bid. The product will not be sold unless this price is reached.
                </Typography>
                <TextField
                    label="Reserve Price"
                    placeholder={startPrice}
                    type="number"
                    value={reservePrice}
                    onChange={(e) => setReservePrice(e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!errors.reservePrice}
                    helperText={errors.reservePrice}
                />

                <Typography variant="body2" color="grey">
                    * Please double-check the auction start-end date and time to ensure accuracy to avoid scheduling issues.
                </Typography>
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
                {duration && (
                    <Stack>
                        <Typography variant="body2" color="secondary" sx={{ml: .5}}>
                            <b>Duration:</b> {duration}
                        </Typography>
                    </Stack>
                )}
                <TextField
                    label="Description(optional)"
                    placeholder="You may provide additional auction-related details about the product here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
                <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant="body2" color="grey">
                        <b>Note: </b> Make sure everything is correct before finalizing the auction entry.
                    </Typography>
                    <Box sx={{ py: 2}}>
                        <Button type="submit" variant="contained" color="secondary" sx={{width: 150 }} disabled={loading}>
                            {loading ? 'Creating...' : 'Create Auction'}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default ManageAuction;
