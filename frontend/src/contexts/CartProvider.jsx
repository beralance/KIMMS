import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const userKey = localStorage.getItem('user'); {/* removed: || 'default' */}
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState(() => {
        const user = localStorage.getItem('user')
        if (!user) return []
        const savedCart = localStorage.getItem(`cart_${user}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [notification, setNotification] = useState(null); // For snackbar messages

    useEffect(() => {
        if (userKey) localStorage.setItem(`cart_${userKey}`, JSON.stringify(cartItems));
    }, [cartItems, userKey]);

    const addToCart = (product) => {
        const user = localStorage.getItem('user') // check fresh value
        if (!user) {
            setNotification({ message: "You must log in to add items to cart", severity: "error" });
            navigate('/auth/login');
            return;
        }

        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                setNotification({ message: "This item is already in the cart", severity: "warning" });
                return prev; // Prevent duplicates
            }
            setNotification({ message: 'Item added to cart!', severity: 'success' });
            return [...prev, { ...product }]; // Remove quantity
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
