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
import ProductDetails from "../features/user/shop/ProductDetails";
import Checkout from "../features/user/checkout/Checkout";
import Success from '../features/user/checkout/Success'
import Cancel from '../features/user/checkout/Cancel'


// Admin Pages
import Dashboard from '../features/admin/dashboard/Dashboard'
import ManageProducts from '../features/admin/manageProducts/ManageProducts'

// Public Pages
import NotFound from "../pages/NotFound";

// Auth 
import Login from '../features/auth/Login'
import Signup from '../features/auth/Signup'

// Layouts
import AdminLayout from '../layout/AdminLayout'
import UserLayout from '../layout/UserLayout'
import CartLayout from "../layout/CartLayout";

export default function AppRoutes() {
    return (
        <Routes>
            {/* User Layout */}
            <Route path='/auth/login' element={<Login/>}/>
            <Route path='/auth/signup' element={<Signup/>}/>
            <Route path="/product/:id" element={<ProductDetails/>}/>

            <Route path='/checkout' element={
                <UserProtectedRoute>
                    <Checkout/>
                </UserProtectedRoute>
            }/>

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
                <Route path="/" element={<Home/>}/>
                <Route path='/shop' element={<Shop/>}/>

                {/* User Protected Routes*/}
                <Route path="/auction" element={
                    <UserProtectedRoute>
                        <Auction/>
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
