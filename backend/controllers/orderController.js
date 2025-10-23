// backend/controllers/orderController.js
import Order from "../models/Order.js";
import { sendEmail } from '../utils/sendEmail.js'
// ✅ Create a new order


export const getOrdersForPolling = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "products.productId", 
                select: 'productName physicalCode images price category details description condition price isLocal',
                populate:{
                    path: 'category',
                    select: 'name',
                }
            })
            .populate("userId", 'fullName email address avatar phonenumber')
            .populate('auctionId', 'endtime starttime status reservePrice startPrice')
            .sort({createdAt: -1})
        res.json(orders);
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: 'Failed to fetch orders'})
    }
}

export const createOrder = async (req, res) => {
    try {
        const { 
            userId, 
            products, 
            totalPrice, 
            orderType = 'fixed',
            auctionId = null,
            priorityLevel = null,
        } = req.body;

        if (!userId || !products?.length || !totalPrice) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (orderType === 'auction' && !auctionId) {
            return res.status(400).json({message: 'Auction ID required for auction orders'})
        }

        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            orderType,
            auctionId,
            priorityLevel,
            purchaseStatus: "pending",  
            paymentStatus: "pending",
        });

        const savedOrder = await newOrder.save();

        console.log(
            `New ${orderType.toUpperCase()} order created: ${savedOrder._id}`
        )

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
        const query = userId ? {userId} : {};

        const orders = await Order.find(query)
            .populate({
                path: "products.productId", 
                select: 'productName physicalCode images price details description category condition price isLocal',
                populate:{
                    path: 'category',
                    select: 'name',
                }
            })
            .populate("userId", 'fullName email address avatar phonenumber')
            .populate('auctionId', 'endtime starttime status reservePrice startPrice')
            .sort({createdAt: -1})

        res.status(200).json(orders);
    } catch (err) {
        console.error("❌ Error fetching orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ✅ Search Order
export const searchOrder = async (req, res) => {
    try {
        const {orderId} = req.query
        if (!orderId) return res.status(400).json({message: 'Order ID required'})
        
        const order = await Order.findOne({orderId})
            .populate('userId', 'email fullName address number')

        if (!order) return res.status(400).json({message: 'Order not found'})

        res.status(200).json(order)
    }
    catch (err) {
        console.error('Error searching orders:', err)
        res.status(500).json({message: 'Failed to search order'})
    }
}

// ✅ Get single order
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({
                path: "products.productId", 
                select: 'productName images prices details description category isLocal condition',
                populate: {
                    path: 'category',
                    select: 'name',
                }
            })
            .populate("userId", 'fullName email role')
            .populate('auctionId', 'endTime status')

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (err) {
        console.error("❌ Error fetching order:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};

// ✅ Update order status (admin or system automation)
export const updateOrderStatus = async (req, res) => {
    try {
        const { purchaseStatus, paymentStatus, adminNote } = req.body;

        const order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (purchaseStatus) order.purchaseStatus = purchaseStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (adminNote) order.adminNote = adminNote;

        const updatedOrder = await order.save();

        await updatedOrder.populate('userId')
        await updatedOrder.populate('products')
        
        console.log(
            `Order ${order._id} updated: purchaseStatus=${order.purchaseStatus}, paymentStatus=${order.paymentStatus}`
        )

        //send email to user based on status
        if (updatedOrder.userId && updatedOrder.userId.email) {
            await sendEmail({
                to: updatedOrder.userId.email,
                subject: `Update on your order: ${updatedOrder.orderId}`,
                text: (
                    `
                        Hi ${updatedOrder.userId.fullName},

                        OrderID: ${updatedOrder.purchaseStatus}
                        Purchase Status: ${updatedOrder.purchaseStatus}
                        Payment Status: ${updatedOrder.paymentStatus}

                        Clicking the link below to view your order
                        ${process.env.FRONTEND_URL}/my-purchases
                    `
                ),
                html: 
                    `
                        <h2>Order Update</h2>
                        <p>Hi ${updatedOrder.userId.fullName},</p>
                        <p>Your order <strong>#${updatedOrder.orderId}</strong> has been updated:</p>
                        <ul>
                            <li><strong>Purchase Status:</strong> ${updatedOrder.purchaseStatus}</li>
                            <li><strong>Payment Status:</strong> ${updatedOrder.paymentStatus}</li>
                        </ul>
                        <p><a href="${process.env.FRONTEND_URL}/my-purchases">Click here to view your order</a></p>
                    `,
            })
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("❌ Error updating order:", err);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

// Cancel an order (Admin or system fallback)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({message: 'Order not found'})
    
        // Prevent cancel if already delivered or refunded
        if (['delivered', 'refunded'].includes(order.purchaseStatus)){
            return res.status(400).json({message: 'Delivered/refunded orders cannot be cancelled'})
        }

        order.purchaseStatus = 'cancelled'
        await order.save()

        console.log(`Order ${order._id} cancelled`)
        res.status(200).json({message: 'Order cancelled successfully'})
    }
    catch (err) {
        console.error('Error cancelling order:', err)
        res.status(500).json({message: 'Failed to cancel order'})
    }
}