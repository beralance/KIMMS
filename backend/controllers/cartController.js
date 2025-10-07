import Cart from "../models/Cart.js";
import Product from '../models/Product.js'
import mongoose from "mongoose";


// GET cart for logged-in user
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.productId',
                select: "productName category images price status description",
                match: {purchaseStatus: "available"},
                populate: {
                    path: 'category',
                    select: 'name createdAt'
                }
            }).lean();

        // If cart doesn't exist, create an empty one
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
            cart = await cart.populate({
                path: 'items.productId',
                select: "productName category images price status description",
                match: {purchaseStatus: "available"}
            });
        }

        // remove item where productId didn't match (null after populate)
        cart.items = cart.items.filter(item => item.productId != null)

        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get cart" });
    }
};

// ADD item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        // find product
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({error: 'Product not found'})

        // backend restriction, block local only items for non local user
        if (product.isLocal && !req.user.isLocal) {
            return res.status(403).json({error: 'You cannot add local-only products to your cart'})
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = await Cart.create({ userId, items: [] });

        // Check if product is already in cart
        const exists = cart.items.some((i) => i.productId.toString() === productId);
        if (!exists) {
            cart.items.push({ productId });
            await cart.save();
        }

        await cart.populate("items.productId", "productName category images price description");

        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// REMOVE single item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
        await cart.save();

        await cart.populate("items.productId", "productName category images price description");
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove item" });
    }
};

// CLEAR entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = [];
        await cart.save();

        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to clear cart" });
    }
};
// cartController.js
export const removePurchased = async (req, res) => {
    console.log('✅✅✅✅✅remove purchase is being called ✅✅✅✅✅')
    try {
        const userId = req.user.id;
        const { removeIds } = req.body; // ✅ this matches what frontend sends

        console.log("🟡 removePurchased called for user:", userId);
        console.log("🟡 removeIds:", removeIds);

        if (!removeIds || !removeIds.length) {
            return res.status(400).json({ message: "No productIds provided" });
        }

        // Filter out purchased products from the cart
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId: { $in: removeIds } } } }, // ✅ MongoDB pull
            { new: true }
        ).populate("items.productId", "productName category images price description");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        console.log("✅ Updated cart after removePurchased:", cart);
        res.json(cart);
    } catch (err) {
        console.error("❌ Error in removePurchased:", err);
        res.status(500).json({ error: "Failed to remove purchased items" });
    }
};
