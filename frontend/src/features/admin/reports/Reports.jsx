import { useEffect, useState } from "react";
import { useReport } from "../../../contexts/ReportContext";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/material";

const Reports = () => {
    const {
        fetchReports,
        loading,
        error,
        alerts,
        closedAuctions,
        endedAuctions,
        liveAuctions,
        pendingAuctions,
        totalAuctions,

        activeListings,
        filteredCount,
        soldItems,
        totalProducts,

        auctionOrders,
        averageOrderValue,
        failedPayments,
        fixedOrders,
        paidOrders,
        pendingPayments,
        refundedOrders,
        totalOrders,
        totalRevenue,

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
    } = useReport();
    
    // make this by pick
    useEffect(() => {
        fetchReports({ period: "month" });
    }, []);

    if (loading)
        return (
            <Box textAlign="center" mt={5}>
                <CircularProgress />
            </Box>
        );

    if (error)
        return (
            <Box mt={5}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Reports
      </Typography>

        <>
          {/* Inventory Stats */}
          <Typography variant="h6" mt={3} mb={1}>
            Inventory Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Total Products</Typography>
                  <Typography variant="h5">
                    {totalProducts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Active Listings</Typography>
                  <Typography variant="h5">
                    {activeListings}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Sold Items</Typography>
                  <Typography variant="h5">
                    {soldItems}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Auctions Stats */}
          <Typography variant="h6" mt={3} mb={1}>
            Auction Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography>Total Auctions</Typography>
                  <Typography variant="h5">
                    {totalAuctions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography>Live Auctions</Typography>
                  <Typography variant="h5">
                    {liveAuctions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography>Pending Auctions</Typography>
                  <Typography variant="h5">
                    {pendingAuctions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography>Ended Auctions</Typography>
                  <Typography variant="h5">
                    {endedAuctions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {alerts.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle1" color="error">
                Alerts
              </Typography>
              {alerts.map((alert, i) => (
                <Alert key={i} severity="warning" sx={{ my: 1 }}>
                  {alert.message}
                </Alert>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Products Stats */}
          <Typography variant="h6" mt={3} mb={1}>
            Product Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Total Products</Typography>
                  <Typography variant="h5">
                    {totalProductsCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Active Products</Typography>
                  <Typography variant="h5">
                    {activeProducts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Sold Products</Typography>
                  <Typography variant="h5">
                    {soldProducts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Orders Stats */}
          <Typography variant="h6" mt={3} mb={1}>
            Orders Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Total Orders</Typography>
                  <Typography variant="h5">
                    {totalOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Completed Orders</Typography>
                  <Typography variant="h5">
                    {paidOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography>Pending Orders</Typography>
                  <Typography variant="h5">
                    {pendingPayments}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
    </Box>
  );
};

export default Reports;
