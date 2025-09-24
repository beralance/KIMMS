// src/context/OrderContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

export const OrderContext = createContext();

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user, token } = useAuth()


    // 1️⃣ Fetch all orders (admin) or optionally filter by userId
    const fetchOrders = async () => {
        try {
            setIsLoading(true)
            const res = await fetch('http://localhost:5000/api/orders', {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })

            if (!res.ok) {
                throw new Error('Failed to fetch orders')
            }
            const data = await res.json()
            console.log('% this is the DATA', data)
            console.log('% this is the ORDERS', orders)
            setOrders(data)
            console.log('% this is the DATA', data)
            console.log('% this is the ORDERS', orders)
            return data
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            return[]
        } finally {
            setIsLoading(false);
        }
    };

    // 2️⃣ Create a new order
    const createOrder = async ({ userId, products, totalPrice }) => {
        try {
            setIsLoading(true);
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, products, totalPrice }),
            });
            const newOrder = await res.json();
            if (res.ok) setOrders(prev => [newOrder, ...prev]);
            return newOrder;
        } catch (err) {
            console.error("Failed to create order:", err);
            return { error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    // 3️⃣ Update order status (admin or webhook)
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purchaseStatus: newStatus }),
            });
            const updatedOrder = await res.json();
            if (res.ok) {
                setOrders(prev => prev.map(o => (o._id === orderId ? updatedOrder : o)));
            }
            return updatedOrder;
        } catch (err) {
            console.error("Failed to update order status:", err);
        return { error: err.message };
        }
    };

    useEffect(() => {
        // Optionally fetch all orders on mount (e.g., admin)
        if(token) {
            fetchOrders();
        }
    }, []);

    return (
        <OrderContext.Provider
            value={{
                orders,
                isLoading,
                fetchOrders,
                createOrder,
                updateOrderStatus,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}
