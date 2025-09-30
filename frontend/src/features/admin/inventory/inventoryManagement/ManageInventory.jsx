import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, Container, Button, MenuItem, Select, InputLabel, FormControl, Typography, CircularProgress, Collapse, ListItem, ListItemText, Stack, IconButton, FormControlLabel, Switch } from "@mui/material";
import { InventoryContext } from '../../../../contexts/InventoryContext';
import PhysicalCodeDisplayer from '../components/PhysicalCodeDisplayer';
import { useSnackbar } from '../../../../contexts/SnackbarContext'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import FullScreenLoader from '../../../../components/FullScreenLoader';
import {CheckBox, CheckRounded, CloseRounded, DeleteForeverRounded, EditOffRounded, EditRounded, FrontHand} from '@mui/icons-material'
import {deleteCategory, addCategory, fetchCategories} from '../../../../utils/categoryApi'


export default function ProductForm() { // <-- accept callback
    // Product Data
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState('')
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [newCategory, setNewCategory] = useState("");
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState('')
    const [isLocal, setIsLocal] = useState(true)

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState(null)
    const [open, setOpen] = useState(false);
    const { addInventoryItem, error } = useContext(InventoryContext)
    const { showSnackbar } = useSnackbar()
    const [openAddCategory, setOpenAddCategory] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    

    // load categoried on mount
    useEffect(() => {
        (async () => {
            const data = await fetchCategories()
            setCategories(data)
        })();
    }, [])

    const formatNumber = (value) => {
        if (!value) return "";
        const digits = value.replace(/\D/g, ""); // keep only numbers
        if (digits === "") return "";
        return new Intl.NumberFormat().format(Number(digits));
    };
    // handle category
    const handleAddCategory = async () => {
        if (!newCategory) {
            showSnackbar('Please add a category', 'warning')
            return;
        }
        const exists = categories.some(
            (cat) => cat.name.toLowerCase() === newCategory.toLowerCase()
        )
        if (exists) {
            showSnackbar('Category already added', 'warning')
            return
        }
        try {
            const added = await addCategory(newCategory)

            setCategories((prev) => [...prev, added])
            setCategory(added._id)
            setNewCategory('')
            showSnackbar('Category added!', 'success')
        }
        catch(err) {
            console.error(err.message)
        }
    }

    const handleRemoveCategory = async () => {
        if (selectedCategories.length === 0) {
            showSnackbar('No category selected to remove', 'warning');
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
            const successful = results.filter(r => r.ok);
            const failed = results.filter(r => !r.ok);

            // Update state for successful deletions
            if (successful.length > 0) {
                setCategories(prev =>
                    prev.filter(cat => !successful.some(s => s.cat._id === cat._id))
                );
                showSnackbar(`${successful.length} category(ies) removed`, 'success');
            }

            // Show errors for failed deletions
            if (failed.length > 0) {
                failed.forEach(f => showSnackbar(`${f.cat.name}: ${f.message}`, 'error'));
            }

            // Clear selection
            setSelectedCategories([]);
        } catch (err) {
            console.error(err);
            showSnackbar('Something went wrong', 'error');
        }
    };

    
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files).filter(file => file instanceof File);
            console.log('prev', images)
            console.log('filesarray:', filesArray)
            setImages((prev) => [...prev, ...filesArray]);

            e.target.value = null;
        }
    };

    const handlePriceChange = (e) => {
        const {value} = e.target
        setPrice(formatNumber(value))
    };

    const handleSubmit = async () => {
        if (error) {
            showSnackbar(error, 'error')
            return
        }
        if (!productName || !description || !details || !price || !category || !condition || images.length === 0) {
            showSnackbar("Please fill in all fields and upload an image.", 'warning');
            return;
        }
        
        const numericPrice = Number(price.replace(/,/g, ''))
        setLoading(true);
        setSuccess(false);

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("description", description);
        formData.append('details', details);
        formData.append("price", numericPrice);
        formData.append("category", category);
        formData.append('condition', condition);
        formData.append('tags', tags);
        formData.append('isLocal', isLocal);
        images.forEach((file) => formData.append('images', file))



        try {
            const newItem = await addInventoryItem(formData);
            console.log(newItem)
            setSuccess(true)
            handleOpen()

            // Reset form
            setProductName("");
            setDescription("");
            setDetails('');
            setPrice("");
            setCategory("");
            setImages([]);
            setCondition('')
            setNewCategory('')
            setTags('');

            setLastAddedItem(newItem)
        } 
        catch (err) {
            console.error(err);
            showSnackbar("Error submitting product.", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth='sm'>
            <Typography fontWeight={'bold'} color='grey' variant='body1' sx={{}}>
                Images:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: '100%' }}>
                <Box sx={{display: 'flex', overflowX: 'auto', py: images?.length > 0 ? 2 : 0}}>
                    {images?.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 2, mt: 1, }} >
                            {images.map((img, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        position: 'relative',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: 1,
                                    }}
                                >
                                    {img instanceof File && (
                                        <Box sx={{position: 'relative'}}>
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt={`preview-${index}`}
                                            style={{
                                            width: 200,
                                            aspectRatio: '1/1',
                                            height: 200,
                                            objectFit: 'cover',
                                            }}
                                        />
                                        <IconButton 
                                            onClick={() => {
                                                setImages((prev) => prev.filter((_, i) => i !== index))
                                            }}
                                            size='small' 
                                            sx={{position: 'absolute', top: 0, right: 0}}
                                        >
                                            <CloseRounded/>
                                        </IconButton>
                                        </Box>
                                    )}
                                    <Typography
                                        noWrap
                                        variant="caption"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: '100%',
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: '#fff',
                                            textAlign: 'center',
                                            fontSize: '0.7rem',
                                            p: '2px 0',
                                        }}
                                    >
                                        {img.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        )
                        :
                        <Stack sx={{display: 'flex', alignItems: 'center', py: 2, width: '100%', justifyContent: 'center'}}>
                            <img src="/smileys-sleep.svg" alt="smileys-sleep" style={{aspectRatio: '1/1', width: 80, opacity: .8}}/>
                            <Typography variant="body1" color="secondary">- No image added -</Typography>
                        </Stack>
                    }
                </Box>
                <Typography variant="subtitle2" color="grey">
                    * You can upload multiple images to improve product presentation
                </Typography>
                {/* Upload image BUTTON*/}
                <Button variant="contained" color='secondary' component="label">
                    Upload Image
                    <input 
                        type="file" 
                        hidden 
                        multiple 
                        accept='image/png, image/jpeg, image/webp, image/jpg, image/svg'
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
                    placeholder='Short description...'
                    fullWidth
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    InputLabelProps={{ sx: { color: "#37353E" } }}
                />

                {/* Details TEXT FIELD*/}
                <Typography variant="subtitle2" color="grey">
                    * Enter product details below such as width, height, depth, and other specifications to provide users with a better understanding of your product.
                </Typography>
                <TextField
                    label="Details"
                    placeholder='Product specification...'
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
                    placeholder='PHP 0'
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
                <Box sx={{display: 'flex', width: '100%', gap: 1}}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category"
                            required
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Add Category BUTTON*/}
                    <Button variant='text' color='secondary' onClick={() => setOpenAddCategory(!openAddCategory)}>
                        {openAddCategory ?  <EditOffRounded/> : <EditRounded/>}
                    </Button>
                </Box>

                {/* Add Category COLLAPSE*/}
                <Collapse in={openAddCategory}>
                    <Stack spacing={2} sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2}}>
                        <Box sx={{display: 'flex', gap: 2,}}>
                            <TextField
                                fullWidth
                                variant='standard'
                                label="New Category"
                                value={newCategory}
                                inputProps={{ maxLength: 15}}
                                onChange={(e) => setNewCategory(e.target.value)}
                                size="small"
                            />
                            <IconButton variant='text' color='success' onClick={handleAddCategory}>
                                <CheckRounded/>
                            </IconButton>
                        </Box>
                        <Box sx={{display: 'flex', gap: 2}}>
                            <FormControl fullWidth variant='standard'>
                                <InputLabel id='select-categories-label'>{categories.length === 0 ? 'Nothing to delete' : 'Remove Categories'}</InputLabel>
                                <Select
                                    labelId='select-categories-label'
                                    multiple
                                    disabled={categories.length === 0}
                                    value={selectedCategories.map(cat => cat._id)}
                                    onChange={(e) => {
                                        const selectedIds = e.target.value;
                                        const selectedObjs = categories.filter(cat => selectedIds.includes(cat._id))
                                        setSelectedCategories(selectedObjs)
                                    }}
                                    
                                    renderValue={(selectedIds) =>
                                        categories
                                            .filter(cat => selectedIds.includes(cat._id))
                                            .map(cat => cat.name)
                                            .join(', ')
                                    }
                                >
                                    {categories.map((cat) => (
                                        <MenuItem 
                                            key={cat._id} 
                                            value={cat._id}
                                            sx={{
                                                color: selectedCategories.some(sel => sel._id === cat._id) ? 'secondary' : 'grey',
                                            }}
                                        >
                                            <Box sx={{display: 'flex', gap: 1}}>
                                                {selectedCategories.some(sel => sel._id === cat._id) &&
                                                    <CheckRounded fontSize='small'/>
                                                }
                                                <ListItemText primary={cat.name}/>
                                            </Box>
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            <IconButton variant='text' color='error' onClick={handleRemoveCategory}>
                                <DeleteForeverRounded/>
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
                        <MenuItem value='used'>Used</MenuItem>
                        <MenuItem value='refurbished'>Refurbished</MenuItem>
                        <MenuItem value='new'>New</MenuItem>
                        <MenuItem value='like new'>Like New</MenuItem>
                    </Select>
                </FormControl>
                

                {/*IsLocal or International SWITCH*/}
                <Stack sx={{mb: 2}}>
                    <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                        <Typography variant="body1" fontWeight='bold' color="secondary">
                            Availability:
                        </Typography>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                            <Typography variant="body1" color="secondary">
                                {isLocal ? 'Local' : 'International'}
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isLocal}
                                        onChange={(e) => setIsLocal(e.target.checked)}
                                        color='secondary'
                                    />
                                }
                            >
                            </FormControlLabel>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="grey">
                        <b>International:</b> Items that can be shipped worldwide. <br />
                        <b>Local:</b> Items that are only available for delivery within the local region.<br />
                        <b>Note:</b> 
                        { isEnabled ? 
                            ' Small items can be shipped nationwide.'
                            :
                            ' Large items are typically restricted to local shipping.'

                        }                            
                    </Typography>
                </Stack>

                {/*Submit BUTTON*/}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    color='secondary'
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit"}
                </Button>

                {/*Last added item BUTTON*/}
                {lastAddedItem &&
                    <Button
                        variant="outlined"
                        color='secondary'
                        onClick={() => {
                            if (lastAddedItem) {
                                handleOpen()
                            }
                            else {
                                showSnackbar('No previous code', 'warning') // change to mui akert soon
                            }
                        }}
                        disabled={loading}
                    >
                        View Previos Code
                    </Button>
                }

                {success && <Typography sx={{ color: "green", mt: 1 }}>Product submitted successfully!</Typography>}

                {lastAddedItem && (
                    <PhysicalCodeDisplayer 
                        id={lastAddedItem._id}
                        name={lastAddedItem.productName} 
                        category={lastAddedItem.category}
                        physicalCode={lastAddedItem.physicalCode}
                        status={lastAddedItem.status}
                        open={open} 
                        onClose={handleClose}/>
                )}
                <FullScreenLoader open={loading} message='Adding product...'/>
            </Box>
        </Container>
    );
}
