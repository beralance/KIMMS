// src/context/InventoryContext.jsx
import { createContext, useState, useEffect } from "react";
import {useAuth} from '../contexts/AuthContext'

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [allInventoryItems, setAllInventoryItems] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
    const [error, setError] = useState(null)
    const {token} = useAuth()

    // Fetch all inventory items (filter out reserved/inactive items)
    const fetchInventoryItems = async () => {
        try {
            const res = await fetch(`${API_URL}/api/inventory`, {
                headers: {'Authorization' : `Bearer ${token}`}
            })
            const data = await res.json();
            // Only keep items that are available
            const availableItems = data.filter(item => item.status === "available");
            setInventoryItems(availableItems);
            setAllInventoryItems(data)
        } catch (err) {
            console.error("Error fetching inventory:", err);
        }
    };

    const addInventoryItem = async (itemData) => {
        try {
            const res = await fetch(`${API_URL}/api/inventory`, {
                method: "POST",
                headers: {'Authorization' : `Bearer ${token}`,},
                body: itemData, // FormData with image
            });

            const data = await res.json()
            if (!res.ok) {
                console.error('Error adding inventory item: ', data.error)
                setError(data.error)
                return null;
            }

            setInventoryItems([data, ...inventoryItems]);
            return data;
        } catch (err) {
            console.error("Error adding inventory item:", err);
            setError("Upload failed: network or server error");
            return null;
        }
    };

    const updateInventoryItem = async (id, updatedData) => {
        try {
            const res = await fetch(`${API_URL}/api/inventory/${id}`, {
                method: "PUT",
                headers: {'Authorization' : `Bearer ${token}`,},
                body: updatedData, // FormData if updating image
            });
            const updatedItem = await res.json();
            setInventoryItems((prevItems) => 
                prevItems.map((i) => (i._id === id ? updatedItem : i))
            );
        } catch (err) {
            console.error("Error updating inventory item:", err);
        }
    };

    const deleteInventoryItem = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/inventory/${id}`, { 
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
            });

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.message || 'Failed to delete inventory item')
            }

            const data = await res.json();
            console.log(data.message)

            setInventoryItems((prev) => prev.filter((i) => i._id !== id));
        } catch (err) {
            console.error("Error deleting inventory item:", err);
        }
    };

    const getInventoryById = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/inventory/${id}`, {
                headers: {'Authorization' : `Bearer ${token}`,},
            });
            if (!res.ok) throw new Error("Failed to fetch inventory item");
            return await res.json();
        } catch (err) {
            console.error("Error fetching inventory item by id:", err);
        }
    }

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    return (
        <InventoryContext.Provider
            value={{
                inventoryItems,
                allInventoryItems,
                error,
                fetchInventoryItems,
                addInventoryItem,
                updateInventoryItem,
                deleteInventoryItem,
                getInventoryById,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}
