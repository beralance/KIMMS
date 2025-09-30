import express from "express";
import { getCategories, addCategory, deleteCategory, getPostedCategories, getAllCategoriesFromProducts } from "../controllers/categoryController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getCategories);
router.get('/posted', getPostedCategories);
router.get('/from-products', optionalAuth, getAllCategoriesFromProducts);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);

export default router;
