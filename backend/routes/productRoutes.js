// routes/productRoutes.js
import express from "express";
import {
    postProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByHighlight,
    updateProductHighlight,
    incrementProductViews,
    getNewestProducts,
} from "../controllers/productController.js";
import {verifyToken, adminOnly, requireRole} from '../middleware/authMiddleware.js'

const router = express.Router();

// POST a product (admin and staff)
router.post("/", verifyToken, requireRole(['admin', 'staff']), postProduct);

// GET newest product
router.get('/new', getNewestProducts)

// SEARCH products
router.get("/search/query", searchProducts);

// GET products by highlight (featured, mostViewed, none)
router.get("/highlight/:type", getProductsByHighlight);

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// UPDATE product (admin and staff)
router.put("/:id", verifyToken, requireRole(['admin', 'staff']), updateProduct);

// SOFT DELETE product (admin and staff)
router.delete("/:id", deleteProduct);

// PATCH highlight of a product
router.patch("/highlight/:id", updateProductHighlight);

// Optional manual increment route
router.patch("/views/:id", incrementProductViews);

export default router;
