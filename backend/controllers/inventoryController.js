import { createClient } from '@supabase/supabase-js';
import Inventory from '../models/Inventory.js';
import {generatePhysicalCode, generateProductId } from '../utils/generatedIds.js'
import {v4 as uuidv4} from 'uuid'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// CREATE Inventory
export const createInventoryItem = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).json({error: 'No files uploaded'})

        const uploadedFiles = [];

        for (const file of files) {

            const sanitizedOriginal = file.originalname.replace(/[\s()]/g, '_');
            const fileName = `products/${Date.now()}-${uuidv4()}-${sanitizedOriginal}`
            const {data, error} = await supabase.storage
                .from('Product-Uploads')
                .upload(fileName, file.buffer, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.mimetype,
                })
            if(error) throw error;
            
            console.log('$$$ DATA PATH', data.path)
            const publicUrl = data
                ? supabase.storage.from('Product-Uploads').getPublicUrl(data.path).data.publicUrl
                : null
        
            if (!publicUrl) throw new Error('Failed to generate public URL');

            console.log(supabase.storage.from('Product-Uploads').getPublicUrl(data.path))
            console.log('$$$ PUBLIC URL', publicUrl)
            
            uploadedFiles.push(publicUrl) 
        }

        const {productName, description, price, category, details, condition, isLocal, tags } = req.body;

        const generatedProductId = await generateProductId(category);
        const generatedPhysicalCode = await generatePhysicalCode(category);

        console.log('### UPLOADED FILES', uploadedFiles)
        const inventoryItem = new Inventory({
            productId: generatedProductId,
            physicalCode: generatedPhysicalCode,
            productName,
            description,
            details,
            condition,
            price,
            category,
            isLocal,
            tags,
            status: 'available',
            images: uploadedFiles,
        });

        try {
            const savedItem = await inventoryItem.save()
            await savedItem.populate('category', 'name')
            res.status(201).json(savedItem)
        }
        catch (dbError) {
            for (const fileUrl of uploadedFiles) {
                const path = fileUrl.split('/Product-Uploads/')[1]
                await supabase.storage.from('Product-Uploads').remove([path])
            }
            throw dbError;
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error('Inventory creation error:', err);
    }
};

// GET All Inventory Items
export const getInventoryItems = async (req, res) => {
    try {
        const {status} = req.query
        const filter = status ? {status} : {}
        const items = await Inventory.find(filter)
            .sort({ createdAt: -1 })
            .populate('category', 'name');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET Single Inventory Item
export const getInventoryItemById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Inventory Item
export const updateInventoryItem = async (req, res) => {
    try {
        const updates = {
            ...req.body,
            images: req.file ? `/uploads/${req.file.filename}` : req.body.images,
        };

        const item = await Inventory.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE Inventory Item
export const deleteInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
