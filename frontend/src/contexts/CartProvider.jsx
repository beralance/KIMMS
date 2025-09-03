// contexts/CartProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const userKey = localStorage.getItem('user') || 'guest';

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem(`cart_${userKey}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [notification, setNotification] = useState(null); // For snackbar messages

    useEffect(() => {
        localStorage.setItem(`cart_${userKey}`, JSON.stringify(cartItems));
    }, [cartItems, userKey]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
            setNotification({ message: "This item is already in the cart", severity: "warning" });
            return prev; // Prevent duplicates
        }
        setNotification({message: 'Item added to cart!', severity: 'success'})
        return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, notification, setNotification }}>
            {children}
        </CartContext.Provider>
    );
};
