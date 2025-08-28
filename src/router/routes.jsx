import React from "react";
import { Routes, Route } from "react-router-dom";

// Restriction
import UserProtectedRoute from "./UserProtectedRoute";
import AdminRoute from "./AdminRoute";

// User Pages
import Home from '../features/user/home/Home'
import Shop from '../features/user/shop/Shop'
import Auction from '../features/user/auction/Auction'
import Cart from "../features/user/cart/Cart";

// Admin Pages
import Dashboard from '../features/admin/dashboard/Dashboard'
import ManageProducts from '../features/admin/manageProducts/ManageProducts'

// Public Pages
import NotFound from "../pages/NotFound";

// Layouts
import AdminLayout from '../layout/AdminLayout'
import UserLayout from '../layout/UserLayout'
import Login from '../features/auth/Login'
import Signup from '../features/auth/Signup'

export default function AppRoutes() {
    return (
        <Routes>
            {/* User Layout */}
            <Route path='/auth/login' element={<Login/>}/>
            <Route path='/auth/signup' element={<Signup/>}/>
            
            <Route element={<UserLayout/>}>

                {/* Public Routes */}
                <Route path="/" element={<Home/>}/>
                <Route path='/shop' element={<Shop/>}/>

                {/* User Protected Routes*/}
                <Route path="/auction" element={
                    <UserProtectedRoute>
                        <Auction/>
                    </UserProtectedRoute>
                    }
                />
                <Route path="/cart" element={
                    <UserProtectedRoute>
                        <Cart/>
                    </UserProtectedRoute>
                    }
                />
            </Route>

            {/* Admin Layout*/}
            <Route element={<AdminLayout/>}>

                {/* Admin Protected Routes*/}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Dashboard/>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/manage-products"
                    element={
                        <AdminRoute>
                            <ManageProducts />
                        </AdminRoute>
                    }
                />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
