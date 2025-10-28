import React from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";

// Restriction
import UserProtectedRoute from "./UserProtectedRoute";
import AdminRoute from "./AdminRoute";
import StaffProtectedRoute from "./StaffProtectedRoute";
import AdminStaffRoute from "./AdminStaffRoute";
import { ReportProvider } from "../contexts/ReportContext";

// User Pages
import Home from '../features/user/home/Home'
import Shop from '../features/user/shop/Shop'
import Auction from '../features/user/auction/Auction'
import Cart from "../features/user/cart/Cart";
import ProductDetails from "../features/user/shop/ProductDetails";
import Checkout from "../features/user/checkout/Checkout";
import Success from '../features/user/checkout/Success'
import Cancel from '../features/user/checkout/Cancel'
import AuctionProductDetails from '../features/user/auction/AuctionProductDetails'
import AuctionListing from "../features/user/auction/AuctionListing";
import AuctionHistory from '../features/user/auction/AuctionHistory'
import AuctionHistoryDetails from '../features/user/auction/AuctionHistoryDetails'
import AuctionProductPreview from '../features/user/auction/AuctionProductPreview'
import UserOrders from '../features/user/orders/UserOrders'
import SoldProductDetails from '../features/user/shop/SoldProductDetails'
import Notification from "../features/user/notification/notification";


// Admin Pages
import Dashboard from '../features/admin/dashboard/Dashboard'
import Inventory from '../features/admin/inventory/Inventory' // change Inventory to inventory  soon
import Orders from "../features/admin/orders/Orders";
import Reports from "../features/admin/reports/Reports";
import QrPreview from "../pages/QrPreview";
import StaffManagement from "../features/admin/staff/StaffManagement"; 
import InventoryManagement from "../features/admin/inventory/inventoryManagement/InventoryManagement";
import ProductManagement from "../features/admin/inventory/productManagement/ProductManagement";
import AuctionManagement from "../features/admin/inventory/auctionManagement/AuctionManagement";
import StaffDashboard from '../features/staff/StaffDashboard'

// Public Pages
import NotFound from "../pages/NotFound";

// Auth 
import Auth from '../features/auth/Auth'
import SignupForm from '../features/auth/components/SignupForm'
import LoginForm from '../features/auth/components/LoginForm'
import VerifyForm from '../features/auth/components/VerifyForm'
import AccountDelete from '../features/auth/accountUpdate/AccountDelete'
import AccountPreview from '../features/auth/accountUpdate/AccountPreview'
import AddressForm from '../features/auth/accountUpdate/AddressForm'
import UpdateAccount from '../features/auth/accountUpdate/UpdateAccount'
import UpdateGeneral from '../features/auth/accountUpdate/UpdateGeneral'
import UpdateEmail from '../features/auth/accountUpdate/UpdateEmail'
import UpdatePassword from '../features/auth/accountUpdate/UpdatePassword'


// Layouts
import AdminLayout from '../layout/AdminLayout'
import UserLayout from '../layout/UserLayout'
import CartLayout from "../layout/CartLayout";
import AuctionLayout from "../layout/AuctionLayout";
import UserOrdersLayout from "../layout/UserOrdersLayout";
import AccountLayout from "../layout/AccountLayout";

export default function AppRoutes() {
    return (
        <Routes>
            {/* User Layout */}
            <Route path="/auth" element={<Auth/>}>
                <Route path='login' element={<LoginForm/>}/>
                <Route path='signup' element={<SignupForm/>}/>
            </Route>
            <Route path="/auth/signup/verify" element={<VerifyForm/>}/>
            <Route path="/auth/signup/address" element={<AddressForm/>}/>
            <Route element={<AccountLayout/>}>
                <Route path="/account" element={<AccountPreview/>}/>
                <Route path="/account/update" element={<UpdateAccount/>}/>
                <Route path="/account/update-information" element={<UpdateGeneral/>}/>
                <Route path="/account/update-email" element={<UpdateEmail/>}/>
                <Route path="/account/update-address" element={<AddressForm/>}/>
                <Route path="/account/update-password" element={<UpdatePassword/>}/>
                <Route path="/account/account-deletion" element={<AccountDelete/>}/>
            </Route>
            {/*
            <Route path='/auth/login' element={<Auth/>}/>
            <Route path='/auth/signup' element={<Auth/>}/>
            <Route path="/auth/signup/verify" element={<VerifyForm/>}/>
            */}

            <Route element={<AccountLayout/>}>
                <Route path="/notification" element={
                    <UserProtectedRoute>
                        <Notification/>
                    </UserProtectedRoute>
                }/>
            </Route>

            <Route path="/product/:id" element={<ProductDetails/>}/>

            <Route path="/product/sold/:id" element={
                <UserProtectedRoute>
                    <SoldProductDetails/>
                </UserProtectedRoute>
            }/>
                
            <Route path='/checkout' element={
                <UserProtectedRoute>
                    <Checkout/>
                </UserProtectedRoute>
            }/>

            <Route element={<UserOrdersLayout/>}>
                <Route path='/my-purchases' element={
                    <UserProtectedRoute>
                        <UserOrders/>
                    </UserProtectedRoute>
                }/>
            </Route>

            <Route path='/success' element={
                <UserProtectedRoute>
                    <Success/>
                </UserProtectedRoute>
            }/>

            <Route path="/cancel" element={
                <UserProtectedRoute>
                    <Cancel/>
                </UserProtectedRoute>    
            }/>
            
            <Route element={<CartLayout/>}>
                <Route path="/cart" element={
                    <UserProtectedRoute>
                        <Cart/>
                    </UserProtectedRoute>
                    }
                />
            </Route>
            <Route element={<UserLayout/>}>
                {/* Public Routes */}
                <Route path="/" index element={<Home/>}/>
                <Route path='/shop' element={<Shop/>}/>

                {/* User Protected Routes*/}
                {/* Auction */}
                <Route path="/auction" element={
                    <UserProtectedRoute>
                        <Auction/>
                    </UserProtectedRoute>
                    }
                >
                    <Route index path="listing" element={<AuctionListing/>}/>
                    <Route path="history" element={<AuctionHistory/>}/>
                </Route>
            </Route>
            
            {/* Auction Details */}
            <Route element={<AuctionLayout/>}>
                <Route path="/auction/listing/details/:id" element={<AuctionProductDetails/>}/>
                <Route path="/auction/history/history-details/:id" element={<AuctionHistoryDetails/>}/>
            </Route>
            <Route path="/auction/listing/product-preview/:id" element={<AuctionProductPreview/>}/>

            {/* ADMIN ROUTES */}
            <Route path="admin" element={
                <AdminRoute>
                    <ReportProvider>
                        <AdminLayout />
                    </ReportProvider>
                </AdminRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />}>
                    <Route path="manage-inventory" element={<InventoryManagement />} />
                    <Route path="manage-product" element={<ProductManagement />} />
                    <Route path="manage-auction" element={<AuctionManagement />} />
                </Route>
                <Route path="orders" element={<Orders />} />
                <Route path="reports" element={<Reports />} />
                <Route path="manage-staff" element={<StaffManagement />} />
            </Route>

            {/* STAFF ROUTES */}
            <Route element={<StaffProtectedRoute/>}>
                <Route path="staff" element={<AdminLayout/>}>
                    <Route index element={<StaffProtectedRoute moduleName='dashboard'><StaffDashboard /></StaffProtectedRoute>} />
                    <Route path="inventory" element={<StaffProtectedRoute moduleName="inventory"><Inventory /></StaffProtectedRoute>}>
                        <Route path="manage-inventory" element={<StaffProtectedRoute moduleName="inventory-management"><InventoryManagement /></StaffProtectedRoute>} />
                        <Route path="manage-product" element={<StaffProtectedRoute moduleName="product-management"><ProductManagement /></StaffProtectedRoute>} />
                        <Route path="manage-auction" element={<StaffProtectedRoute moduleName="auction-management"><AuctionManagement /></StaffProtectedRoute>} />
                    </Route>
                    <Route path="orders" element={<StaffProtectedRoute moduleName="order"><Orders /></StaffProtectedRoute>} />
                    <Route path="reports" element={<StaffProtectedRoute moduleName="report"><Reports /></StaffProtectedRoute>} />
                </Route>
            </Route>
            {/* QR Preview */}
            <Route
                path="/qr-preview/:id"
                element={
                    <AdminStaffRoute>
                        <QrPreview/>
                    </AdminStaffRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
