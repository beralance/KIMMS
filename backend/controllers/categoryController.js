import Category from "../models/Category.js";
import Inventory from '../models/Inventory.js'

export const getCategories = async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
};

export const addCategory = async (req, res) => {
    const { name } = req.body;
    const exists = await Category.findOne({ name });

    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
};

export const deleteCategory = async (req, res) => {

    try {
        const category = await Category.findById(req.params.id)
        if(!category) {
            return res.status(404).json({message: 'Category not found'})
        }

        const exists = await Inventory.exists({category: category._id})

        if (exists) {
            return res.status(400).json({
                message: 'Cannot delete category, its still used by products'
            })
        }

        await Category.findByIdAndDelete(req.params.id);
        return res.json({ message: "Category deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Server error'})
    }
};
