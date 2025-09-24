import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./SnackbarContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};

export const CartProvider = ({ children }) => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState(null);

    /** 🔹 Fetch Cart */
    const fetchCart = async () => {
        if (!token) {
            setCartItems([]);
            return;
        }

        try {
            const res = await fetchWithAuth(
                "http://localhost:5000/api/cart",
                {token},
                logout
            );

            const data = await res.json();
            const validItems = (data.items || []).filter(item => item.productId);
            setCartItems(validItems);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    /** 🔹 Add to Cart */
    const addToCart = async (product) => {
        if (!token) {
            showSnackbar("You must log in to add items", "error");
            navigate("/auth/login");
            return;
        }

        if (cartItems.some(item => item.productId?._id === product._id)) {
            showSnackbar("Item is already in your cart!", "warning");
            return;
        }

        try {
            const res = await fetchWithAuth(
                "http://localhost:5000/api/cart",
                {
                    method: "POST",
                    body: { productId: product._id },
                    token,
                },
                logout
            );

            const data = await res.json();
            const validItems = (data.items || []).filter(item => item.productId);
            setCartItems(validItems);
            showSnackbar("Item added to cart!", "success");
        } catch (err) {
            console.error("Failed to add item:", err);
            showSnackbar("Failed to add item", "error");
        }
    };

    /** 🔹 Remove from Cart */
    const removeFromCart = async (productId) => {
        if (!token) return;

        try {
            const res = await fetchWithAuth(
                `http://localhost:5000/api/cart/${productId}`,
                { method: "DELETE", token },
                logout
            );

            const data = await res.json();
            const validItems = (data.items || []).filter(item => item.productId);
            setCartItems(validItems);
        } catch (err) {
            console.error("Failed to remove item:", err);
        }
    };

    /** 🔹 Clear Cart */
    const clearCart = async () => {
        if (!token) return;

        try {
            await fetchWithAuth(
                "http://localhost:5000/api/cart/clear",
                { method: "DELETE", token },
                logout
            );

            setCartItems([]);
        } catch (err) {
            console.error("Failed to clear cart:", err);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                notification,
                setNotification,
                refreshCart: fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
