import express from "express";
import {
    deleteSubCategory,
    getSubCategories,
    addSubCategory,
    getCategories,
    addCategory,
    deleteCategory,
    getPostedCategories,
    getAllCategoriesFromProducts,
} from "../controllers/categoryController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getCategories);
router.get("/posted", getPostedCategories);
router.get("/from-products", optionalAuth, getAllCategoriesFromProducts);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);

router.post("/:categoryId/subcategories", addSubCategory);
router.get("/:categoryId/subcategories", getSubCategories);
router.delete("/:categoryId/subcategories", deleteSubCategory);

export default router;
