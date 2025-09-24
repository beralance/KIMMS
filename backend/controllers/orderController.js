// backend/controllers/orderController.js
import Order from "../models/Order.js";

// ✅ Create a new order
export const createOrder = async (req, res) => {
    try {
        const { userId, products, totalPrice } = req.body;

        if (!userId || !products?.length || !totalPrice) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            purchaseStatus: "pending",
            paymentStatus: "pending",
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error("❌ Error creating order:", err);
        res.status(500).json({ message: "Failed to create order" });
    }
};

// ✅ Get all orders (admin) or by user
export const getOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        let orders;

        if (userId) {
            orders = await Order.find({ userId })
                .populate("products.productId")
                .populate("userId", 'fullName email role')
        } else {
            orders = await Order.find()
                .populate("products.productId")
                .populate("userId", 'fullName email role')
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error("❌ Error fetching orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ✅ Get single order
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.productId")
            .populate("userId", 'fullName email role');

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (err) {
        console.error("❌ Error fetching order:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};

// ✅ Update order status (admin or system)
export const updateOrderStatus = async (req, res) => {
    try {
        const { purchaseStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (purchaseStatus) order.purchaseStatus = purchaseStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("❌ Error updating order:", err);
        res.status(500).json({ message: "Failed to update order status" });
    }
};
