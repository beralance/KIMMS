// controllers/checkoutController.js
import Cart from "../models/Cart.js";
import Order from '../models/Order.js'
import Product from "../models/Product.js";
import Inventory from '../models/Inventory.js';

export const handleCheckout = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const cart = await Cart.findOne({ userId }).populate("items.productId", 'images productName condition price');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const invalidItems = cart.items.filter(
            item => item.productId?.isLocal && !req.user.isLocal
        );

        if (invalidItems.length > 0) {
            return res.status(403).json({
                message: 'Your cart containes products not available in your region',
                blockedProducts: invalidItems.map(i => i.productId?.productName)
            })
        }
        const productIds = cart.items
            .map((item) => item.productId?._id)
            .filter(Boolean);

        if (productIds.length === 0) {
            return res.status(400).json({ message: "No valid products in cart" });
        }

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 1),
            0
        );
        res.status(200).json({ totalAmount, productIds });
    } 
    catch (err) {
        console.error("Checkout error:", err);
        res.status(500).json({ message: "Checkout failed", error: err.message });
    }
};

export const handleCodCheckout = async (req, res) => {
    try {
        const {userId, products, totalPrice, finalPrice, orderType} = req.body;
        console.log('Checkout Items in Backend', products)

        if (!userId) {
            return res.status(400).json({message: 'userId are required'})
        }

        if (!products || products.length === 0) {
            return res.status(400).json({message: 'Cart is empty'})
        }

        const newOrder = await Order.create({
            userId,
            products,
            totalPrice,
            finalPrice,
            orderType,
            paymentMethod: 'cashOnDelivery',
            paymentStatus: 'unpaid',
            purchaseStatus: 'pending',
            orderStatus: 'SUCCESSFUL'
        })

        console.log('PRODUCTS', products)
        const productIds = products.map(item => item.productId)
        console.log('PRODUCT IDS ARRAY', productIds)
        
        await Product.updateMany(
            { _id: { $in: productIds} },
            { $set: { visibility: 'pending', purchaseStatus: "pending", purchasedBy: userId} }
        );

        const prod = await Product.find({_id: {$in: productIds}})
        const inventoryIds = prod.map(p => p.inventoryId)
        if (inventoryIds.length) {
            await Inventory.updateMany(
                {_id: {$in: inventoryIds}},
                {$set: {status: 'sold'}},
            )
        }
        const userCart = await Cart.findOne({ userId });
        if (userCart) {
            userCart.items = userCart.items.filter(
                cartItem => !productIds.includes(cartItem.productId.toString())
            );
            await userCart.save();
        }

        req.io.emit('removeCartItem', { userId, productIds, })
        req.io.emit('productSold', productIds)

        res.status(201).json({
            message: 'Order placed successfully with COD.',
            order: newOrder,
        })
    }
    catch (err) {
        console.error('COD checkout error: ', err)
        res.status(500).json({message: 'COD checkout failed', error: err.message})
    }
}
