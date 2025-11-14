import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./SnackbarContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import {useSocket} from './SocketContext'

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
    const socket = useSocket()

    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    
    useEffect(() => {
        if (!socket) return

        socket.on('removeCartItem', (data) => {
            console.log('📢 Cart items ID removed', data.productIds)
            console.log('IDS inside cart', cartItems)
            setCartItems((prev) => prev.filter((p) => !data.productIds.includes(p.productId._id)))
        })

        if (!socket.emittedTestMessage) {
            socket.emit("testMessage", "Hello from client!");
            socket.emittedTestMessage = true;
        }

        return ()  => {
            socket.off('removeCartItem')
        }
    }, [socket])

    /** 🔹 Fetch Cart */
    const fetchCart = async () => {
        if (!token) {
            setCartItems([]);
            return;
        }
        
        try {
            const res = await fetchWithAuth(
                `${API_URL}/api/cart`,
                {token},
                logout
            );

            const data = await res.json();
            const validItems = (data.items || []).filter(item => item.productId);
            console.log('IDS inside cart', cartItems)
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
            showSnackbar("This item is already added to your cart!", "warning");
            return;
        }
        console.log('THIS IS THE TOKEN^^^^^^^', token)

        try {
            const res = await fetchWithAuth(
                `${API_URL}/api/cart`,
                {
                    method: "POST",
                    body: { productId: product._id },
                    token,
                },
                logout
            );

            if (!res.ok) {
                const errText = await res.text();
                console.error('Add to cart failed: ', errText);
                showSnackbar('Failed to add item', 'error')
                return;
            }

            const data = await res.json();
            const validItems = (data.items || []).filter(item => item.productId);
            setCartItems(validItems);

            if (validItems.some(item => item.productId?._id === product._id)){
                showSnackbar(`${product.productName} added to cart!`, 'success')
            }
            else {
                showSnackbar('Failed to add item', 'error')
            }
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
                `${API_URL}/api/cart/${productId}`,
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
                `${API_URL}/api/cart/clear`,
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
