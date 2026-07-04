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
    getProductsForPolling,
    updateProductHighlight,
    incrementProductViews,
    getNewestProducts,
} from "../controllers/productController.js";
import {verifyToken, adminOnly, requireRole} from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/", verifyToken, requireRole(['admin', 'staff']), postProduct);

router.get('/new', getNewestProducts)

router.get("/search/query", searchProducts);

router.get("/highlight/:type", getProductsByHighlight);

router.get("/polling", getProductsForPolling);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", verifyToken, requireRole(['admin', 'staff']), updateProduct);

router.delete("/:id", deleteProduct);

router.patch("/highlight/:id", updateProductHighlight);

router.patch("/views/:id", incrementProductViews);

export default router;
