import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";

export const getProductsForPolling = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.json(products);
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: 'Failed to fetch orders'})
    }
}

// POST Inventory item to Products collection (publish to shop)
export const postProduct = async (req, res) => {
    try {
        const { inventoryId } = req.body;
        const addedBy = req.user?.id;

        // Find the inventory item
        const inventoryItem = await Inventory.findById(inventoryId);
        if (!inventoryItem) return res.status(404).json({ message: "Inventory item not found" });

        if (inventoryItem.status !== "available") {
            return res.status(400).json({ message: "Item is not available for posting" });
        }

        const weight = !inventoryItem.isLocal ? inventoryItem.weight : undefined;

        // Create new Product from Inventory data
        const product = new Product({
            inventoryId: inventoryItem._id,
            productId: inventoryItem.productId,
            productName: inventoryItem.productName,
            description: inventoryItem.description,
            details: inventoryItem.details,
            price: inventoryItem.price,
            category: inventoryItem.category._id,
            condition: inventoryItem.condition,
            images: inventoryItem.images,
            tags: inventoryItem.tags,
            isLocal: inventoryItem.isLocal,
            physicalCode: inventoryItem.physicalCode,
            visibility: "active",
            addedBy: addedBy,
            weight: weight || undefined,
            // add physical code here
        });

        await product.save();

        // Update inventory status to prevent double posting
        inventoryItem.status = "reserved"; 
        await inventoryItem.save();

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET all active posted products
export const getProducts = async (req, res) => {
    try {
        const user = req.user;
        let query = {visibility: 'active'}
        
        if (user) {
            if (user.role === 'admin' || user.role === 'staff') {
            } else {
                query.isLocal = user.isLocal;
            }
        }

        const products = await Product.find(query)
                                      .sort({ createdAt: -1 })
                                      .populate('category', 'name');
        res.json(products);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
    }
};

// GET new products
export const getNewestProducts = async (req, res) => {
    try {
        const user = req.user;
        let query = {visibility: 'active'}

         if (user) {
            if (user.role === 'admin' || user.role === 'staff') {
                // see all products
            } else {
                query.isLocal = user.isLocal;
            }
        }

        const products = await Product
            .find({visibility: 'active'})
            .sort({createdAt: -1})
            .limit(10)
            .populate('category', 'name')
        res.json(products)
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
}

// GET single product (for product detail page)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("inventoryId").populate('category', 'name');
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Optional: increment views automatically
        await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE posted product (admin can change price, description, etc.)
export const updateProduct = async (req, res) => {
    try {
        const updates = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('category', 'name');

        if (!product) return res.status(404).json({ message: "Product not found" });
        
        // Sync critical fields back to inventory
        const syncFields = {};

        if (updates.price !== undefined) syncFields.price = updates.price;
        if (updates.condition !== undefined) syncFields.condition = updates.condition;
        if (updates.details != undefined) syncFields.details = updates.details

        if (Object.keys(syncFields).length > 0) {
            await Inventory.findByIdAndUpdate(product.inventoryId, syncFields)
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SOFT DELETE posted product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { visibility: "inactive" },
            { new: true }
        ).populate('category', 'name');

        if (!product) return res.status(404).json({ message: "Product not found" });

        // Reset Inventory item status back to "available"
        await Inventory.findByIdAndUpdate(product.inventoryId, { status: "available" });

        res.json({ message: "Product marked inactive and inventory reset", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SEARCH Products
export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === "") return res.json([]);

        const regex = new RegExp(q, "i");
        const products = await Product.find({
            visibility: "active",
            $or: [
                { productName: regex },
                { description: regex },
                { condition: regex},
                { tags: regex},
                { 'category.name': regex }

            ],
        }).sort({ createdAt: -1 }).populate('category', 'name');

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET products by highlight (featured, mostViewed, none)
export const getProductsByHighlight = async (req, res) => {
    try {
        const { type } = req.params;

        if (!['featured', 'mostViewed', 'none'].includes(type)) {
            return res.status(400).json({ message: 'Invalid highlight type' });
        }

        let products;
        if (type === 'mostViewed') {
            products = await Product.find({ visibility: 'active' })
                                    .sort({ views: -1 })
                                    .limit(10); // limit max 20: change 5 to 20
        } else if (type === 'featured') {
            products = await Product.find({ visibility: 'active', highlight: type })
                                    .sort({ createdAt: -1 })
                                    .limit(10)
                                    .populate('category', 'name');
        } else {
            products = await Product.find({ visibility: 'active', highlight: type })
                                    .sort({ createdAt: -1 })
                                    .populate('category', 'name');
        }

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH product highlight with limit enforcement
export const updateProductHighlight = async (req, res) => {
    try {
        const { highlight } = req.body;
        const validHighlights = ['mostViewed', 'featured', 'none'];

        if (!validHighlights.includes(highlight)) {
            return res.status(400).json({ message: "Invalid highlight value" });
        }

        // Enforce limit only for featured or mostViewed
        if (highlight === 'featured' || highlight === 'mostViewed') {
            const count = await Product.countDocuments({ highlight });
            if (count >= 10) { // max 20
                return res.status(400).json({ message: `${highlight} limit reached (max 5)` });
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { highlight },
            { new: true }
        ).populate('category', 'name');

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Increment views manually (optional if not using auto increment)
export const incrementProductViews = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductReportStats = async ({ period, category }) => {
    const filter = {};

    if (category) filter.category = category;

    if (period) {
        const now = new Date();
        let startDate;

        switch (period) {
            case 'daily':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'monthly':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'yearly':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = null;
        }

        if (startDate) filter.createdAt = { $gte: startDate };
    }

    const products = await Product.find(filter).populate('category', 'name');

    if (!products.length) {
        return {
            totalProducts: 0,
            active: 0,
            inactive: 0,
            sold: 0,
            pending: 0,
            available: 0,
            mostViewed: 'N/A',
            recentlySold: 'N/A',
            averagePrice: 0,
            categoryBreakdown: {},
        };
    }
 
    const newPostedProduct = products.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)

    const visibilityCounts = { active: 0, inactive: 0, sold: 0, pending: 0 };
    const purchaseCounts = { available: 0, pending: 0, sold: 0 };
    let totalPrice = 0;
    const categoryBreakdown = {};
    const conditionBreakdown = {}; 

    products.forEach((p) => {
        visibilityCounts[p.visibility]++;
        purchaseCounts[p.purchaseStatus]++;
        totalPrice += p.price;

        const catName = p.category?.name || 'Uncategorized';
        categoryBreakdown[catName] = (categoryBreakdown[catName] || 0) + 1;

        const cond = p.condition || 'Unknown';
        conditionBreakdown[cond] = (conditionBreakdown[cond] || 0) + 1;
    });

    const mostViewed = products.sort((a, b) => b.views - a.views).slice(0, 5);
    const recentlySold = products
        .filter((p) => p.purchaseStatus === 'sold')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);
    const averagePrice = totalPrice / products.length;
    const activeProducts = products.filter((p) => p.visibility === 'active' && p.purchaseStatus === 'available').length


    return {
        totalProducts: products.length,
        ...visibilityCounts,
        purchaseStatusSummary: purchaseCounts,
        mostViewed,
        recentlySold,
        activeProducts,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        categoryBreakdown,
        conditionBreakdown,
        newPostedProduct,
    };
};
