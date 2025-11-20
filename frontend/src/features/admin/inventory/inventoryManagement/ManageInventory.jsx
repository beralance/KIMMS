import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    TextField,
    Container,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    CircularProgress,
    Collapse,
    ListItem,
    ListItemText,
    Stack,
    IconButton,
    FormControlLabel,
    Switch,
    Divider,
} from "@mui/material";
import { InventoryContext } from "../../../../contexts/InventoryContext";
import PhysicalCodeDisplayer from "../components/PhysicalCodeDisplayer";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import FullScreenLoader from "../../../../components/FullScreenLoader";
import {
    CheckBox,
    CheckRounded,
    CloseRounded,
    CompareSharp,
    DeleteForeverRounded,
    EditOffRounded,
    EditRounded,
    FrontHand,
} from "@mui/icons-material";
import {
    deleteCategory,
    addCategory,
    fetchCategories,
} from "../../../../utils/categoryApi";
import { toTitleCase } from "../../../../utils/stringUtils";

export default function ProductForm({ productId, onClose }) {
    // <-- accept callback
    // Product Data
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState("");
    const [isLocal, setIsLocal] = useState(true);
    const [existingImages, setExistingImages] = useState([]);
    const [itemWeight, setItemWeight] = useState(0);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState(null);
    const [open, setOpen] = useState(false);
    const { addInventoryItem, getInventoryById, updateInventoryItem, error } =
        useContext(InventoryContext);
    const { showSnackbar } = useSnackbar();
    const [openAddCategory, setOpenAddCategory] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [mode, setMode] = useState(productId ? "edit" : "create");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const loadItem = async () => {
            setLoading(true);
            try {
                if (!productId) return;
                const item = await getInventoryById(productId);
                if (!item) {
                    showSnackbar("Item was not found", "warning");
                    return;
                }
                setProductName(item.productName || "");
                setDescription(item.description || "");
                setDetails(item.details || "");
                setPrice(item.price?.toString() || "");
                setCategory(item.category || "");
                setCondition(item.condition || "");
                setTags(item.tags || "");
                setIsLocal(item.isLocal ?? true);
                setExistingImages(item.images || []);
                setItemWeight(item.weight || 0);

                console.log("Loaded item:", item);
            } catch (err) {
                console.error("Failed to load item: ", err);
                showSnackbar(`Failed to get item ${productName}`, "error");
            } finally {
                setLoading(false);
            }
        };
        if (productId) {
            setMode("edit");
            loadItem();
        } else {
            setMode("create");
            resetForm();
        }
    }, [productId]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchCategories();
                setCategories(data || []);
            } catch (err) {
                console.log("Failed to fetch categories", err);
                showSnackbar("Failed to load categories", "error");
            }
        })();
    }, [categories]);

    const formatNumber = (value) => {
        if (!value) return "";
        const digits = value.replace(/\D/g, ""); // keep only numbers
        if (digits === "") return "";
        return new Intl.NumberFormat().format(Number(digits));
    };
    // handle category
    const handleAddCategory = async () => {
        if (!newCategory) {
            showSnackbar("Please add a category", "warning");
            return;
        }
        const exists = categories.some(
            (cat) => cat.name.toLowerCase() === newCategory.toLowerCase()
        );
        if (exists) {
            showSnackbar("Category already added", "warning");
            return;
        }
        try {
            const added = await addCategory(newCategory);

            setCategories((prev) => [...prev, added]);
            setCategory(added._id);
            setNewCategory("");
            showSnackbar("Category added!", "success");
            fetchCategories();
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleRemoveCategory = async () => {
        if (selectedCategories.length === 0) {
            showSnackbar("No category selected to remove", "warning");
            return;
        }

        try {
            const results = await Promise.all(
                selectedCategories.map(async (cat) => {
                    const { ok, data } = await deleteCategory(cat._id);
                    return { cat, ok, message: data.message };
                })
            );

            // Separate successful and failed deletions
            const successful = results.filter((r) => r.ok);
            const failed = results.filter((r) => !r.ok);

            // Update state for successful deletions
            if (successful.length > 0) {
                setCategories((prev) =>
                    prev.filter(
                        (cat) => !successful.some((s) => s.cat._id === cat._id)
                    )
                );
                showSnackbar(
                    `${successful.length} category(ies) removed`,
                    "success"
                );
            }

            // Show errors for failed deletions
            if (failed.length > 0) {
                failed.forEach((f) =>
                    showSnackbar(`${f.cat.name}: ${f.message}`, "error")
                );
            }
            fetchCategories();
            // Clear selection
            setSelectedCategories([]);
        } catch (err) {
            console.error(err);
            showSnackbar("Something went wrong", "error");
        }
    };

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files).filter(
                (file) => file instanceof File
            );
            console.log("prev", images);
            console.log("filesarray:", filesArray);
            setImages((prev) => [...prev, ...filesArray]);

            e.target.value = null;
        }
    };

    const handlePriceChange = (e) => {
        const { value } = e.target;
        setPrice(formatNumber(value));
    };

    const resetForm = () => {
        setProductName("");
        setDescription("");
        setDetails("");
        setPrice("");
        setCategory("");
        setCondition("");
        setTags("");
        setImages([]);
        setExistingImages([]);
        setNewCategory("");
        setItemWeight(0);
    };

    const handleSubmit = async () => {
        console.log("Weight", itemWeight);
        if (error) {
            showSnackbar(error, "error");
            return;
        }
        if (
            !productName ||
            !description ||
            !details ||
            !price ||
            !category ||
            !condition
        ) {
            showSnackbar("Please fill in all fields.", "warning");
            return;
        }

        if (isLocal === false && (!itemWeight || itemWeight <= 0)) {
            showSnackbar(
                "Please enter a valid item weight (1–10 kg).",
                "warning"
            );
            return;
        }
        if (itemWeight > 10) {
            showSnackbar("Maximum weight allowed is 10 kg.", "warning");
            return;
        }
        // Image check
        if (
            (mode === "create" && images.length === 0) ||
            (mode === "edit" && existingImages.length + images.length === 0)
        ) {
            showSnackbar("Please upload at least one image.", "warning");
            return;
        }

        const numericPrice = Number(price.replace(/,/g, ""));

        const formData = new FormData();
        formData.append("productName", toTitleCase(productName));
        formData.append("description", description);
        formData.append("details", details);
        formData.append("price", numericPrice);
        formData.append("category", toTitleCase(category));
        formData.append("condition", condition);
        formData.append("tags", toTitleCase(tags));
        formData.append("isLocal", isLocal);
        formData.append("itemWeight", itemWeight);
        formData.append("existingImages", JSON.stringify(existingImages || []));
        images
            .filter(Boolean)
            .forEach((file) => formData.append("images", file));

        console.log("Weight", formData);

        try {
            setLoading(true);
            if (mode === "edit") {
                await updateInventoryItem(productId, formData);
                showSnackbar("Item updated successfully!", "success");
                onClose();
            } else {
                const newItem = await addInventoryItem(formData);
                setLastAddedItem(newItem);
                showSnackbar("Item added successfully!", "success");
                handleOpen();
                resetForm();
            }
        } catch (err) {
            console.error(err);
            showSnackbar("Error submitting product.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography
                fontWeight={"bold"}
                color="grey"
                variant="body1"
                sx={{}}
            >
                Images:
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        py: images?.length > 0 ? 2 : 0,
                    }}
                >
                    {existingImages?.length > 0 || images?.length > 0 ? (
                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                            {/* Show existing images from DB*/}
                            {existingImages.map((img, index) => (
                                <Box
                                    key={`existing-${index}`}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        position: "relative",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        boxShadow: 1,
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`existing-${index}`}
                                        style={{
                                            width: 200,
                                            aspectRatio: "1/1",
                                            height: 200,
                                            objectFit: "cover",
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            setExistingImages((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                        }}
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                        }}
                                    >
                                        <CloseRounded />
                                    </IconButton>
                                    <Typography
                                        variant="caption"
                                        noWrap
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            width: "100%",
                                            bgcolor: "rgba(0, 0, 0, 0.5)",
                                            color: "#fff",
                                            textAlign: "center",
                                            fontSize: "0.7rem",
                                            p: "2px 0",
                                        }}
                                    >
                                        {`Existing Image ${index}`}
                                    </Typography>
                                </Box>
                            ))}

                            {/*Show newly uploaded images*/}
                            {images.map((img, index) => (
                                <Box
                                    key={`new-${index}`}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        position: "relative",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        boxShadow: 1,
                                    }}
                                >
                                    {img instanceof File && (
                                        <Box sx={{ position: "relative" }}>
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`preview-${index}`}
                                                style={{
                                                    width: 200,
                                                    aspectRatio: "1/1",
                                                    height: 200,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <IconButton
                                                onClick={() => {
                                                    setImages((prev) =>
                                                        prev.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                    );
                                                }}
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 0,
                                                }}
                                            >
                                                <CloseRounded />
                                            </IconButton>
                                        </Box>
                                    )}
                                    <Typography
                                        noWrap
                                        variant="caption"
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            width: "100%",
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            color: "#fff",
                                            textAlign: "center",
                                            fontSize: "0.7rem",
                                            p: "2px 0",
                                        }}
                                    >
                                        {img.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Stack
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                py: 2,
                                width: "100%",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="/smileys-sleep.svg"
                                alt="smileys-sleep"
                                style={{
                                    aspectRatio: "1/1",
                                    width: 80,
                                    opacity: 0.8,
                                }}
                            />
                            <Typography variant="body1" color="secondary">
                                - No image added -
                            </Typography>
                        </Stack>
                    )}
                </Box>
                <Typography variant="subtitle2" color="grey">
                    * You can upload multiple images to improve product
                    presentation
                </Typography>
                {/* Upload image BUTTON*/}
                <Button variant="contained" color="secondary" component="label">
                    Upload Image
                    <input
                        type="file"
                        hidden
                        multiple
                        accept="image/png, image/jpeg, image/webp, image/jpg, image/svg"
                        onChange={handleImageUpload}
                    />
                </Button>
                <Typography variant="subtitle2" color="grey">
                    * Make sure very field is entered before submission
                </Typography>
                {/* Product name TEXT FIELD*/}
                <TextField
                    label="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    InputLabelProps={{ sx: { color: "#37353E" } }}
                />

                {/* Description TEXT FIELD*/}
                <TextField
                    label="Description"
                    multiline
                    placeholder="Short description..."
                    fullWidth
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    InputLabelProps={{ sx: { color: "#37353E" } }}
                />

                {/* Details TEXT FIELD*/}
                <Typography variant="subtitle2" color="grey">
                    * Enter product details below such as width, height, depth,
                    and other specifications to provide users with a better
                    understanding of your product.
                </Typography>
                <TextField
                    label="Details"
                    placeholder="Product specification..."
                    multiline
                    rows={5}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                    InputLabelProps={{ sx: { color: "#37353E" } }}
                />

                {/* Price TEXT FIELD*/}
                <TextField
                    label="Price"
                    placeholder="PHP 0"
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    InputLabelProps={{ sx: { color: "#37353E" } }}
                />

                {/* Category SELECT FIELD*/}
                <Typography variant="subtitle2" color="grey">
                    * Add or edit categories by clicking the edit icon.
                </Typography>
                <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category"
                            required
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Add Category BUTTON*/}
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={() => setOpenAddCategory(!openAddCategory)}
                    >
                        {openAddCategory ? <EditOffRounded /> : <EditRounded />}
                    </Button>
                </Box>

                {/* Add Category COLLAPSE*/}
                <Collapse in={openAddCategory}>
                    <Stack
                        spacing={2}
                        sx={{ bgcolor: "#f8f8f8", p: 2, borderRadius: 2 }}
                    >
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="New Category"
                                value={newCategory}
                                inputProps={{ maxLength: 15 }}
                                onChange={(e) => setNewCategory(e.target.value)}
                                size="small"
                            />
                            <IconButton
                                variant="text"
                                color="success"
                                onClick={handleAddCategory}
                            >
                                <CheckRounded />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="select-categories-label">
                                    {categories.length === 0
                                        ? "Nothing to delete"
                                        : "Remove Categories"}
                                </InputLabel>
                                <Select
                                    labelId="select-categories-label"
                                    multiple
                                    disabled={categories.length === 0}
                                    value={selectedCategories.map(
                                        (cat) => cat._id
                                    )}
                                    onChange={(e) => {
                                        const selectedIds = e.target.value;
                                        const selectedObjs = categories.filter(
                                            (cat) =>
                                                selectedIds.includes(cat._id)
                                        );
                                        setSelectedCategories(selectedObjs);
                                    }}
                                    renderValue={(selectedIds) =>
                                        categories
                                            .filter((cat) =>
                                                selectedIds.includes(cat._id)
                                            )
                                            .map((cat) => cat.name)
                                            .join(", ")
                                    }
                                >
                                    <Typography
                                        variant="body2"
                                        color="grey"
                                        sx={{
                                            maxWidth: 300,
                                            p: 1,
                                            mb: 0.5,
                                            textWrap: "wrap",
                                        }}
                                    >
                                        <b>Note:</b> Grey categories are not
                                        used by any products and can be safely
                                        deleted
                                    </Typography>
                                    <Divider />
                                    {categories.map((cat) => (
                                        <MenuItem
                                            key={cat._id}
                                            value={cat._id}
                                            sx={{
                                                color: selectedCategories.some(
                                                    (sel) =>
                                                        sel._id >= cat._id ||
                                                        null
                                                )
                                                    ? "secondary"
                                                    : "grey",
                                            }}
                                        >
                                            <Box
                                                sx={{ display: "flex", gap: 1 }}
                                            >
                                                {selectedCategories.some(
                                                    (sel) => sel._id === cat._id
                                                ) && (
                                                    <CheckRounded fontSize="small" />
                                                )}
                                                <ListItemText
                                                    primary={cat.name}
                                                    primaryTypographyProps={{
                                                        color:
                                                            cat.productCount ===
                                                            0
                                                                ? "grey"
                                                                : "black",
                                                    }}
                                                />
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <IconButton
                                variant="text"
                                color="error"
                                onClick={handleRemoveCategory}
                            >
                                <DeleteForeverRounded />
                            </IconButton>
                        </Box>
                    </Stack>
                </Collapse>

                {/* Add Condition SELECT*/}
                <FormControl>
                    <InputLabel>Condition</InputLabel>
                    <Select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        label="Condition"
                    >
                        <MenuItem value="used">Used</MenuItem>
                        <MenuItem value="refurbished">Refurbished</MenuItem>
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="like new">Like New</MenuItem>
                    </Select>
                </FormControl>

                {/*IsLocal or International SWITCH*/}
                <Stack sx={{ mb: 2, gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Stack>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="secondary"
                                >
                                    Available for:
                                </Typography>
                                <Typography variant="body1" color="secondary">
                                    {isLocal ? "Local" : "International"}{" "}
                                    customers
                                </Typography>
                            </Stack>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isLocal}
                                        onChange={(e) =>
                                            setIsLocal(e.target.checked)
                                        }
                                        color="secondary"
                                    />
                                }
                            ></FormControlLabel>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="grey">
                        <b>International:</b> Items that can be shipped
                        worldwide. <br />
                        <b>Local:</b> Items that are only available for delivery
                        within the local region.
                        <br />
                        <b>Note:</b>
                        {isEnabled
                            ? " Small items can be shipped nationwide."
                            : " Large items are typically restricted to local shipping."}
                    </Typography>
                </Stack>
                <Box>
                    {!isLocal && (
                        <Stack>
                            <TextField
                                type="number"
                                fullWidth
                                label="Item Weight (kg)"
                                value={itemWeight}
                                onChange={(e) => setItemWeight(e.target.value)}
                                placeholder="Enter item weight (max 10kg)"
                                inputProps={{ min: 0, max: 10 }}
                            />
                            <Typography variant="body2" color="gray">
                                Weight is used for small or international items
                                (max 10kg)
                            </Typography>
                        </Stack>
                    )}
                </Box>

                {/*Submit BUTTON*/}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    color="secondary"
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                        "Submit"
                    )}
                </Button>

                {/*Last added item BUTTON*/}
                {lastAddedItem && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            if (lastAddedItem) {
                                handleOpen();
                            } else {
                                showSnackbar("No previous code", "warning"); // change to mui akert soon
                            }
                        }}
                        disabled={loading}
                    >
                        View Previos Code
                    </Button>
                )}
                {lastAddedItem && (
                    <PhysicalCodeDisplayer
                        id={lastAddedItem._id}
                        name={lastAddedItem.productName}
                        category={lastAddedItem.category}
                        physicalCode={lastAddedItem.physicalCode}
                        image={lastAddedItem.images[0]}
                        status={lastAddedItem.status}
                        open={open}
                        onClose={handleClose}
                    />
                )}
                <FullScreenLoader
                    open={loading}
                    message={
                        mode === "create"
                            ? "Adding product..."
                            : "Updating product..."
                    }
                />
            </Box>
        </Container>
    );
}
