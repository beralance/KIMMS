// backend/controllers/orderController.js
import Order from "../models/Order.js";
import Inventory from '../models/Inventory.js'
import Product from '../models/Product.js'
import { sendEmail } from '../utils/sendEmail.js'


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
            .populate("userId", 'fullName email gender isLocal address avatar phoneNumber')
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
            finalPrice,
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
            finalPrice,
            orderType,
            auctionId,
            priorityLevel,
            purchaseStatus: "pending",  
            paymentStatus: "pending",
        });
        const savedOrder = await newOrder.save();

        if (products && products.length > 0) {
            await Promise.all(
                products.map(item =>
                    Product.findByIdAndUpdate(item.productId, {purchasedBy: userId})
                )
            );
        }
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
                select: 'productName physicalCode images price category details description condition price isLocal',
                populate:{
                    path: 'category',
                    select: 'name',
                }
            })
            .populate("userId", 'fullName email gender isLocal address avatar address phonenumber')
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
            .populate("userId", 'fullName email gender isLocal address avatar phonenumber')
            .populate('auctionId', 'endtime starttime status reservePrice startPrice')

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
    
        if (!['admin', 'user'].includes(req.user.role)) {
            return res.status(403).json({message: 'You are not allowed to cancel orders'})
        }

        if (!req.user.role === 'admin' && ['delivered', 'processing'].includes(order.purchaseStatus)){
            return res.status(400).json({message: 'Processing orders cannot be cancelled'})
        }

        await Promise.all(
            order.products.map(item =>
                Product.findByIdAndUpdate(
                    item.productId,
                    {
                        highlight: 'none',
                        purchaseStatus: 'cancelled',
                        visibility: 'cancelled',
                    }
                )
            )
        );

        await Promise.all(
            order.products.map(async item => {
                const product = await Product.findById(item.productId);
                if (product && product.inventoryId) {
                    await Inventory.findByIdAndUpdate(product.inventoryId, {status: 'available'});
                }
            })
        );

        order.purchaseStatus = 'cancelled'
        order.orderStatus = 'CANCELLED'
        order.cancelledBy = req.user.id
        await order.save()

        console.log(`Order ${order._id} cancelled`)
        res.status(200).json({message: 'Order cancelled successfully'})
    }
    catch (err) {
        console.error('Error cancelling order:', err)
        res.status(500).json({message: 'Failed to cancel order'})
    }
}

export const getOrderReportStats = async (options = {}) => {
    const {period, paymentMethod, paymentStatus, purchaseStatus} = options

    let filter = {};

    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (purchaseStatus) filter.purchaseStatus = purchaseStatus;

     if (period) {
        const now = new Date();
        let fromDate;

        if (period === 'week') {
            fromDate = new Date();
            fromDate.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            fromDate = new Date();
            fromDate.setMonth(now.getMonth() - 1);
        } else if (period === 'year') {
            fromDate = new Date();
            fromDate.setFullYear(now.getFullYear() - 1);
        } else if (period.from && period.to) {
            fromDate = new Date(period.from);
            const toDate = new Date(period.to);
            filter.createdAt = { $gte: fromDate, $lte: toDate };
        }

        if (fromDate && !filter.createdAt) {
            filter.createdAt = { $gte: fromDate };
        }
    }

    const orders = await Order.find(filter)

    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
    const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;
    const failedPayments = orders.filter(o => o.paymentStatus === 'failed').length;
    const refundedOrders = orders.filter(o => o.paymentStatus === 'refunded').length;
    
    const pendingOrders = orders.filter(o => o.purchaseStatus === 'pending').length;
    const confirmedOrders = orders.filter(o => o.purchaseStatus === 'confirmed').length;
    const processingOrders = orders.filter(o => o.purchaseStatus === 'processing').length;
    const outForDeliveryOrders = orders.filter(o => o.purchaseStatus === 'out_for_delivery').length;
    
    
    const totalRevenue = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.finalPrice, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const fixedOrders = orders.filter(o => o.orderType = 'fixed').length
    const auctionOrders = orders.filter(o => o.orderType = 'auction').length

    return {
        totalOrders, 
        paidOrders,
        pendingPayments,
        failedPayments,
        refundedOrders,
        totalRevenue,
        averageOrderValue,
        fixedOrders,
        auctionOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        outForDeliveryOrders,
    }

}