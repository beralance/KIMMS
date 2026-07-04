import {
    createContext,
    use,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import { getCombinedReport } from "../utils/reportApi";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    // Auctions
    const [alerts, setAlerts] = useState([]);
    const [closedAuctions, setClosedAuctions] = useState(0);
    const [endedAuctions, setEndedAuctions] = useState(0);
    const [liveAuctions, setLiveAuctions] = useState(0);
    const [pendingAuctions, setPendingAuctions] = useState(0);
    const [totalAuctions, setTotalAuctions] = useState(0);

    // Inventory
    const [activeListings, setActiveListings] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    const [soldItems, setSoldItems] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [inventoryItems, setInventoryItems] = useState(0);
    const [newAddedItem, setNewAddedItem] = useState(null);

    // Orders
    const [auctionOrders, setAuctionOrders] = useState(0);
    const [averageOrderValue, setAverageOrderValue] = useState(0);
    const [fixedOrders, setFixedOrders] = useState(0);
    const [paidOrders, setPaidOrders] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [confirmedOrders, setConfirmedOrders] = useState(0);
    const [processingOrders, setProcessingOrders] = useState(0);
    const [outForDeliveryOrders, setOutForDeliveryOrders] = useState(0);

    // Products
    const [activeProducts, setActiveProducts] = useState(0);
    const [averagePrice, setAveragePrice] = useState(0);
    const [categoryBreakdown, setCategoryBreakdown] = useState({});
    const [inactiveProducts, setInactiveProducts] = useState(0);
    const [mostViewed, setMostViewed] = useState(null);
    const [pendingProducts, setPendingProducts] = useState(0);
    const [purchaseStatusSummary, setPurchaseStatusSummary] = useState({});
    const [recentlySold, setRecentlySold] = useState(null);
    const [soldProducts, setSoldProducts] = useState(0);
    const [totalProductsCount, setTotalProductsCount] = useState(0);
    const [conditionBreakdown, setConditionBreakdown] = useState(0);
    const [newPostedProduct, setNewPostedProduct] = useState(null);

    // Loading and Error
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            const data = await getCombinedReport();
            if (!data) return console.log("No data from report context");

            // --- Auctions ---
            setAlerts((prev) =>
                JSON.stringify(prev) !== JSON.stringify(data.auctions.alerts)
                    ? data.auctions.alerts
                    : prev
            );
            setClosedAuctions((prev) =>
                prev !== data.auctions.closedAuctions
                    ? data.auctions.closedAuctions
                    : prev
            );
            setEndedAuctions((prev) =>
                prev !== data.auctions.endedAuctions
                    ? data.auctions.endedAuctions
                    : prev
            );
            setLiveAuctions((prev) =>
                prev !== data.auctions.liveAuctions
                    ? data.auctions.liveAuctions
                    : prev
            );
            setPendingAuctions((prev) =>
                prev !== data.auctions.pendingAuctions
                    ? data.auctions.pendingAuctions
                    : prev
            );
            setTotalAuctions((prev) =>
                prev !== data.auctions.totalAuctions
                    ? data.auctions.totalAuctions
                    : prev
            );

            // --- Inventory ---
            setActiveListings((prev) =>
                prev !== data.inventory.activeListings
                    ? data.inventory.activeListings
                    : prev
            );
            setFilteredCount((prev) =>
                prev !== data.inventory.filteredCount
                    ? data.inventory.filteredCount
                    : prev
            );
            setSoldItems((prev) =>
                prev !== data.inventory.soldItems
                    ? data.inventory.soldItems
                    : prev
            );
            setTotalProducts((prev) =>
                prev !== data.inventory.totalProducts
                    ? data.inventory.totalProducts
                    : prev
            );
            setInventoryItems((prev) =>
                prev !== data.inventory.inventoryItems
                    ? data.inventory.inventoryItems
                    : prev
            );
            setNewAddedItem((prev) =>
                prev !== data.inventory.newAddedItem
                    ? data.inventory.newAddedItem
                    : prev
            );

            // --- Orders ---
            setAuctionOrders((prev) =>
                prev !== data.orders.auctionOrders
                    ? data.orders.auctionOrders
                    : prev
            );
            setAverageOrderValue((prev) =>
                prev !== data.orders.averageOrderValue
                    ? data.orders.averageOrderValue
                    : prev
            );
            setFixedOrders((prev) =>
                prev !== data.orders.fixedOrders
                    ? data.orders.fixedOrders
                    : prev
            );
            setPaidOrders((prev) =>
                prev !== data.orders.paidOrders ? data.orders.paidOrders : prev
            );
            setPendingPayments((prev) =>
                prev !== data.orders.pendingPayments
                    ? data.orders.pendingPayments
                    : prev
            );
            setTotalOrders((prev) =>
                prev !== data.orders.totalOrders
                    ? data.orders.totalOrders
                    : prev
            );
            setTotalRevenue((prev) =>
                prev !== data.orders.totalRevenue
                    ? data.orders.totalRevenue
                    : prev
            );
            setPendingOrders((prev) =>
                prev !== data.orders.pendingOrders
                    ? data.orders.pendingOrders
                    : prev
            );
            setConfirmedOrders((prev) =>
                prev !== data.orders.confirmedOrders
                    ? data.orders.confirmedOrders
                    : prev
            );
            setProcessingOrders((prev) =>
                prev !== data.orders.processingOrders
                    ? data.orders.processingOrders
                    : prev
            );
            setOutForDeliveryOrders((prev) =>
                prev !== data.orders.outForDeliveryOrders
                    ? data.orders.outForDeliveryOrders
                    : prev
            );

            // --- Products ---
            setActiveProducts((prev) =>
                prev !== data.products.activeProducts
                    ? data.products.activeProducts
                    : prev
            );
            setAveragePrice((prev) =>
                prev !== data.products.averagePrice
                    ? data.products.averagePrice
                    : prev
            );
            setCategoryBreakdown((prev) =>
                JSON.stringify(prev) !==
                JSON.stringify(data.products.categoryBreakdown)
                    ? data.products.categoryBreakdown
                    : prev
            );
            setConditionBreakdown((prev) =>
                JSON.stringify(prev) !==
                JSON.stringify(data.products.conditionBreakdown)
                    ? data.products.conditionBreakdown
                    : prev
            );
            setInactiveProducts((prev) =>
                prev !== data.products.inactive ? data.products.inactive : prev
            );
            setMostViewed((prev) =>
                JSON.stringify(prev) !==
                JSON.stringify(data.products.mostViewed)
                    ? data.products.mostViewed
                    : prev
            );
            setPendingProducts((prev) =>
                prev !== data.products.pending ? data.products.pending : prev
            );
            setPurchaseStatusSummary((prev) =>
                JSON.stringify(prev) !==
                JSON.stringify(data.products.purchaseStatusSummary)
                    ? data.products.purchaseStatusSummary
                    : prev
            );
            setRecentlySold((prev) =>
                JSON.stringify(prev) !==
                JSON.stringify(data.products.recentlySold)
                    ? data.products.recentlySold
                    : prev
            );
            setSoldProducts((prev) =>
                prev !== data.products.sold ? data.products.sold : prev
            );
            setTotalProductsCount((prev) =>
                prev !== data.products.totalProducts
                    ? data.products.totalProducts
                    : prev
            );
            setNewPostedProduct((prev) =>
                prev !== data.products.newPostedProduct
                    ? data.products.newPostedProduct
                    : prev
            );

        } catch (err) {
            console.error("Error fetching reports:", err);
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        const interval = setInterval(fetchReports, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ReportContext.Provider
            value={{
                reportData,
                fetchReports,
                loading,
                error,
                // auction
                alerts,
                closedAuctions,
                endedAuctions,
                liveAuctions,
                pendingAuctions,
                totalAuctions,

                // inventory
                activeListings,
                filteredCount,
                soldItems,
                totalProducts,
                inventoryItems,
                newAddedItem,

                //orders
                auctionOrders,
                averageOrderValue,
                fixedOrders,
                paidOrders,
                pendingPayments,
                totalOrders,
                totalRevenue,
                pendingOrders,
                confirmedOrders,
                processingOrders,
                outForDeliveryOrders,

                //products
                activeProducts,
                averagePrice,
                categoryBreakdown,
                inactiveProducts,
                mostViewed,
                pendingProducts,
                purchaseStatusSummary,
                recentlySold,
                soldProducts,
                totalProductsCount,
                conditionBreakdown,
                newPostedProduct,
            }}
        >
            {children}
        </ReportContext.Provider>
    );
};

export const useReport = () => useContext(ReportContext);
