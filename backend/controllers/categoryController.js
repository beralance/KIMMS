import Category from "../models/Category.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

export const getCategories = async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
};

export const addCategory = async (req, res) => {
    const { name } = req.body;
    const exists = await Category.findOne({ name });

    if (exists)
        return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const exists = await Inventory.exists({ category: category._id });

        if (exists) {
            return res.status(400).json({
                message: "Cannot delete category, its still used by products",
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        return res.json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getPostedCategories = async (req, res) => {
    try {
        const categoryIds = await Product.distinct("category", {
            visibility: "active",
        });
        const categories = await Category.find({ _id: { $in: categoryIds } });

        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// controllers/categoryController.js

export const getAllCategoriesFromProducts = async (req, res) => {
    try {
        const user = req.user;

        let matchStage = { visibility: "active" };

        if (user && user.role !== "admin" && user.role !== "staff") {
            if (!user.isLocal) {
                matchStage.isLocal = false;
            }
        }
        const categories = await Product.aggregate([
            { $match: matchStage },

            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    image: { $first: "$images" },
                },
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },

            // Shape the output
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    name: "$category.name",
                    image: 1,
                    count: 1,
                },
            },
        ]);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateCategoryCounts = async () => {
    try {
        const categories = await Category.find();

        for (const category of categories) {
            const count = await Product.countDocuments({
                category: category._id,
            });
            category.productCount = count;
            await category.save();
        }

        console.log("✅ Category counts updated successfully");
    } catch (error) {
        console.error("❌ Error updating category counts:", error);
    }
};

export const incrementProductCount = async (categoryId, increment = 1) => {
    if (!categoryId) return;
    try {
        await Category.findByIdAndUpdate(categoryId, {
            $inc: { productCount: increment },
        });
    } catch (err) {
        console.error(
            `Faile to update productCount for category ${categoryId}:`,
            err
        );
    }
};

export const decrementProductCount = async (categoryId, decrement = 1) => {
    if (!categoryId) return;
    try {
        await Category.findByIdAndUpdate(categoryId, [
            {
                $set: {
                    productCount: {
                        $max: [{ $subtract: ["$productCount", decrement] }, 0],
                    },
                },
            },
        ]);
    } catch (err) {
        console.error(
            `Failed to decrement productCount for ${categoryId}:`,
            err
        );
    }
};

export const addSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subCategoryName } = req.body;

        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(404).json({ message: "Category not found" });

        if (
            category.subCategories.find(
                (sub) =>
                    sub.name.toLowerCase() === subCategoryName.toLowerCase()
            )
        ) {
            return res
                .status(400)
                .json({ message: "Subcategory already exists" });
        }

        category.subCategories.push({ name: subCategoryName });
        await category.save();

        res.status(201).json({ message: "Subcategory added", category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSubCategories = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ subCategories: category.subCategories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subCategoryName } = req.body;

        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(404).json({ message: "Category not found" });

        const subIndex = category.subCategories.findIndex(
            (sub) => sub.name === subCategoryName
        );
        if (subIndex === -1)
            return res.status(404).json({ message: "Subcategory not found" });

        const productsUsing = await Product.find({
            category: categoryId,
            subCategories: subCategoryName,
        });

        if (productsUsing.length > 0) {
            return res.status(400).json({
                message: `Cannot delete this subcategory because it is still assigned to ${productsUsing.length} product(s).`,
                productCount: productsUsing.length,
            });
        }

        category.subCategories.splice(subIndex, 1);
        await category.save();

        res.status(200).json({ message: "Subcategory deleted", category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
