// controllers/checkoutController.js
import Cart from "../models/Cart.js";

export const handleCheckout = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Get user's cart and populate product details
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Backend restriction, block local only products for non local users
        const invalidItems = cart.items.filter(
            item => item.productId?.isLocal && !req.user.isLocal
        );

        if (invalidItems.length > 0) {
            return res.status(403).json({
                message: 'Your cart containes products not available in your region',
                blockedProducts: invalidItems.map(i => i.productId?.productName)
            })
        }
        // Extract product IDs (as ObjectId) and total amount
        const productIds = cart.items
            .map((item) => item.productId?._id)
            .filter(Boolean); // filter out any null/undefined

        if (productIds.length === 0) {
            return res.status(400).json({ message: "No valid products in cart" });
        }

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 1),
            0
        );

        // Optional: clear cart after checkout initiation
        // cart.items = [];
        // await cart.save();

        res.status(200).json({ totalAmount, productIds });
    } 
    catch (err) {
        console.error("Checkout error:", err);
        res.status(500).json({ message: "Checkout failed", error: err.message });
    }
};
