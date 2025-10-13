import { getInventoryReportStats } from "./inventoryController.js";
import { getAuctionReportStats } from "./auctionController.js";


export const getCombinedReport = async (req, res) => {
    try {
        const {period, category, inventoryId} = req.query;

        const inventoryStats = await getInventoryReportStats({period, category})
        const auctionStats = await getAuctionReportStats({
            period,
            category, 
            inventoryId,
            alertThresholds: {pendingHours: 24, liveHours: 2}
        })

        res.json({
            inventory: inventoryStats,
            auctions: auctionStats
        })
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
}