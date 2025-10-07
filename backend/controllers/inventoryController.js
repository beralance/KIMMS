import { createClient } from '@supabase/supabase-js';
import Inventory from '../models/Inventory.js';
import {generatePhysicalCode, generateProductId } from '../utils/generatedIds.js'
import {v4 as uuidv4} from 'uuid'
import { incrementProductCount, decrementProductCount } from './categoryController.js';


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
            await incrementProductCount(category)
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
        let uploadedFiles = JSON.parse(req.body.existingImages || '[]'); 

        
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const sanitizedOriginal = file.originalname.replace(/[\s()]/g, '_');
                const fileName = `products/${Date.now()}-${uuidv4()}-${sanitizedOriginal}`;

                const { data, error } = await supabase.storage
                    .from('Product-Uploads')
                    .upload(fileName, file.buffer, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: file.mimetype,
                    });

                if (error) throw error;

                const publicUrl = data
                    ? supabase.storage.from('Product-Uploads').getPublicUrl(data.path).data.publicUrl
                    : null;

                if (!publicUrl) throw new Error('Failed to generate public URL');
                uploadedFiles.push(publicUrl);
            }
        }

        const currentItem = await Inventory.findById(req.params.id);
        if(!currentItem) return res.status(404).json({message: 'Item not found'})

        let physicalCode = currentItem.physicalCode;
        const currentCategoryId = currentItem.category.toString()
        
        if (req.body.category && req.body.category !== currentCategoryId) {        
            physicalCode = await generatePhysicalCode(req.body.category)
            await decrementProductCount(currentCategoryId)
            await incrementProductCount(req.body.category)
        }

        const updates = {
            productName: req.body.productName,
            description: req.body.description,
            details: req.body.details,
            condition: req.body.condition,
            price: req.body.price,
            category: req.body.category,
            isLocal: req.body.isLocal,
            tags: req.body.tags,
            status: req.body.status,
            images: uploadedFiles,
            physicalCode,
            
        };

        // ✅ Update and populate category
        const item = await Inventory.findByIdAndUpdate(req.params.id, updates, { new: true })
            .populate('category', 'name');

        if (!item) return res.status(404).json({ message: "Item not found" });

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error("Inventory update error:", err);
    }
};

// DELETE Inventory Item
export const deleteInventoryItem = async (req, res) => {
    try {
        // 1️⃣ Find the item first (so we can get its images)
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        // 2️⃣ Remove associated images from Supabase (if any)
        if (item.images && item.images.length > 0) {
            const paths = item.images
                .map(url => url.split('/Product-Uploads/')[1]) // ✅ correct split
                .filter(path => path);

            if (paths.length > 0) {
                const { error: removeError } = await supabase
                    .storage
                    .from('Product-Uploads')
                    .remove(paths);

                if (removeError) {
                    console.error("⚠️ Failed to delete one or more images from storage:", removeError.message);
                }
            }
        }

        console.log('ITEM DATA', item)
        await item.deleteOne();
        await decrementProductCount(item.category)

        res.json({ message: "Item and associated images deleted successfully" });
    } catch (err) {
        console.error("❌ Inventory deletion error:", err);
        res.status(500).json({ error: err.message });
    }
};

