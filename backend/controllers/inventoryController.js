import { fetchCategories } from '../../frontend/src/utils/categoryApi.js';
import Inventory from '../models/Inventory.js';
import {generatePhysicalCode, generateProductId } from '../utils/generatedIds.js'

// CREATE Inventory Item
export const createInventoryItem = async (req, res) => {
    try {
        const {productName, description, price, category, details, condition, isLocal, tags } = req.body;

        const generatedProductId = await generateProductId(category);
        const generatedPhysicalCode = await generatePhysicalCode(category);

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
            images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : [],
        });

        const savedItem = await inventoryItem.save()
        await savedItem.populate('category', 'name')

        res.status(201).json(savedItem);

    } catch (err) {
        res.status(500).json({ error: err.message });
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
