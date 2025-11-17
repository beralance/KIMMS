import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Inventory from "../models/Inventory.js";

export function getDateFilter(range) {
    const now = new Date();
    let start, end;

    switch (range) {
        case "week":
            start = new Date(now.setDate(now.getDate() - 7));
            end = new Date();
            break;
        case "month":
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date();
            break;
        case "year":
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date();
            break;
        default:
            start = range?.start ? new Date(range.start) : null;
            end = range?.end ? new Date(range.end) : null;
    }

    return start && end ? { createdAt: { $gte: start, $lte: end } } : {};
}

export const totalSalesReport = async (range) => {
    const dateFilter = getDateFilter(range);

    const result = await Order.aggregate([
        { $match: { paymentStatus: "paid", ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } },
    ]);
    return result[0]?.total || 0;
};

export const salesPerDayReport = async (range) => {
    const dateFilter = getDateFilter(range);

    const report = await Order.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                orderStatus: "SUCCESSFUL",
                ...dateFilter,
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                totalSales: { $sum: "$finalPrice" },
                totalOrders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return report;
};

export const categoryCountReport = async () => {
    return await Product.aggregate([
        { $match: { visibility: "active", purchaseStatus: "available" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
};

export const userCreatedReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await User.countDocuments({ ...dateFilter });
};

export const salesByCategoryReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await Order.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                orderStatus: "SUCCESSFUL",
                ...dateFilter,
            },
        },
        { $unwind: "$products" },
        {
            $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $lookup: {
                from: "categories",
                localField: "product.category",
                foreignField: "_id",
                as: "category",
            },
        },
        { $unwind: "$category" },
        {
            $group: {
                _id: "$category.name",
                sales: { $sum: "$finalPrice" },
                count: { $sum: 1 },
            },
        },
        { $sort: { sales: -1 } },
    ]);
};

export const salesByConditionReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await Order.aggregate([
        { $match: { paymentStatus: "paid", ...dateFilter } },
        {
            $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $group: {
                _id: "$product.condition",
                sales: { $sum: "$finalPrice" },
                count: { $sum: 1 },
            },
        },
        { $sort: { sales: -1 } },
    ]);
};

// review
export const salesBySizeReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await Order.aggregate([
        { $match: { paymentStatus: "paid", ...dateFilter } },
        {
            $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $group: {
                _id: "$product.isLocal",
                sales: { $sum: "$finalPrice" },
                count: { $sum: 1 },
            },
        },
        { $sort: { sales: -1 } },
    ]);
};

export const userLocationComparisonReport = async () => {
    const total = await User.countDocuments();

    const local = await User.countDocuments({ isLocal: true });
    const international = total - local;

    return {
        localPercent: ((local / total) * 100).toFixed(2),
        international: ((international / total) * 100).toFixed(2),
    };
};

export const stockSizeComparisonReport = async () => {
    return await Product.aggregate([
        { $match: { visibility: "active", purchaseStatus: "available" } },
        {
            $group: {
                _id: "$isLocal",
                count: { $sum: 1 },
            },
        },
    ]);
};

export const auctionSalesReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await Order.aggregate([
        {
            $match: {
                orderType: "auction",
                paymentStatus: "paid",
                ...dateFilter,
            },
        },
        { $group: { _id: null, total: { $sum: "finalPrice" } } },
    ]);
};

export const fixedSalesReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await Order.aggregate([
        {
            $match: {
                orderType: "fixed",
                paymentStatus: "paid",
                ...dateFilter,
            },
        },
        { $group: { _id: null, total: { $sum: "finalPrice" } } },
    ]);
};

export async function categoryPieReport() {
    return await Product.aggregate([
        { $match: { visibility: "active", purchaseStatus: "available" } },
        {
            $group: { _id: "$category", count: { $sum: 1 } },
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryInfo",
            },
        },
        { $unwind: "$categoryInfo" },
        {
            $project: {
                _id: "$categoryInfo.name",
                count: 1,
            },
        },
    ]);
}

export const topCategorySalesReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await Order.aggregate([
        { $match: { paymentStatus: "paid", ...dateFilter } },
        {
            $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $group: {
                _id: "$product.category",
                count: { $sum: 1 },
                sales: { $sum: "$finalPrice" },
            },
        },
        { $sort: { sales: -1 } },
    ]);
};

export const topProductsReport = async (range) => {
    const dateFilter = getDateFilter(range);

    return await Order.aggregate([
        { $match: { paymentStatus: "paid", ...dateFilter } },
        {
            $group: {
                _id: "$productId",
                count: { $sum: 1 },
                totalSales: { $sum: "$finalAmount" },
            },
        },
        { $sort: { totalSales: -1 } },
        { $limit: 10 },
    ]);
};

export const getFullReport = async (req, res) => {
    try {
        const range = req.query.range || "all";
        console.log("Test", range);

        const [
            totalSales,
            categoryCount,
            newUsers,
            salesByCategory,
            salesByCondition,
            salesBySize,
            userLocation,
            stockSize,
            auctionSales,
            fixedSales,
            categoryPie,
            topCategorySales,
            topProducts,
            salesPerDay,
        ] = await Promise.all([
            totalSalesReport(range),
            categoryCountReport(),
            userCreatedReport(range),
            salesByCategoryReport(range),
            salesByConditionReport(range),
            salesBySizeReport(range),
            userLocationComparisonReport(),
            stockSizeComparisonReport(),
            auctionSalesReport(range),
            fixedSalesReport(range),
            categoryPieReport(),
            topCategorySalesReport(range),
            topProductsReport(range),
            salesPerDayReport(range),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalSales,
                categoryCount,
                newUsers,
                salesByCategory,
                salesByCondition,
                salesBySize,
                userLocation,
                stockSize,
                auctionSales,
                fixedSales,
                categoryPie,
                topCategorySales,
                topProducts,
                salesPerDay,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
