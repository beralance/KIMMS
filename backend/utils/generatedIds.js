import Inventory from "../models/Inventory.js";
import Category from '../models/Category.js'
import Counter from '../models/Counter.js'

export const generateProductId = async (categoryId) => {
    const categoryDoc = await Category.findById(categoryId)
    if(!categoryDoc) throw new Error('Category not found')

    const removeSpaceName = categoryDoc.name
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '')
        .toLowerCase();

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateString = `${yyyy}${mm}${dd}`;

    const counter = await Counter.findOneAndUpdate(
        {category: categoryId, date: dateString},
        {$inc: {seq: 1}},
        {new: true, upsert: true}
    )
    const sequence = String(counter.seq).padStart(3, "0");
    return `${removeSpaceName}-${dateString}-${sequence}`;
};

export const generatePhysicalCode = async (categoryId) => {
    const categoryDoc = await Category.findById(categoryId)
     if (!categoryDoc) throw new Error("Category not found");

    const prefix = categoryDoc.name.substring(0, 3).toUpperCase();

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateString = `${yyyy}${mm}${dd}`;

    const lastItem = await Inventory.find({
        category: categoryId,
        createdAt: {
            $gte: new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`),
            $lte: new Date(`${yyyy}-${mm}-${dd}T23:59:59.999Z`)
        }
    })
    .sort({ createdAt: -1 })
    .limit(1);

    const lastSequence = lastItem.length 
        ? parseInt(lastItem[0].physicalCode.split("-")[2]) 
        : 0;

    const sequence = String(lastSequence + 1).padStart(3, "0");

    return `${prefix}-${dateString}-${sequence}`;
};