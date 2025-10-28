import { getInventoryReportStats } from "./inventoryController.js";
import { getAuctionReportStats } from "./auctionController.js";
import { getProductReportStats } from './productController.js'
import { getOrderReportStats } from './orderController.js'

export const getCombinedReport = async (req, res) => {
    try {
        const {period, category, inventoryId} = req.query;

        const [inventoryStats, auctionStats, productStats, orderStats] = await Promise.all([
            getInventoryReportStats({period, category}),
            getAuctionReportStats({
                period,
                category,
                inventoryId,
                alertThresholds: { pendingHours: 24, liveHours: 2},
            }),
            getProductReportStats({period, category}),
            getOrderReportStats({period}),
        ])

        res.json({
            inventory: inventoryStats,
            auctions: auctionStats,
            products: productStats,
            orders: orderStats,
        })
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
}