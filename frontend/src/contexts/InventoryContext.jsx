// src/context/InventoryContext.jsx
import { createContext, useState, useEffect } from "react";
import {useAuth} from '../contexts/AuthContext'

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    
    const [inventoryItems, setInventoryItems] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
    //const API_URL = "http://localhost:5000/api/inventory";
    const {token} = useAuth()
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
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
            const newItem = await res.json();
            setInventoryItems([newItem, ...inventoryItems]);
            return newItem;
        } catch (err) {
            console.error("Error adding inventory item:", err);
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
            setInventoryItems(inventoryItems.map((i) => (i._id === id ? updatedItem : i)));
        } catch (err) {
            console.error("Error updating inventory item:", err);
        }
    };

    const deleteInventoryItem = async (id) => {
        try {
            await fetch(`${API_URL}/api/inventory/${id}`, { 
                method: "DELETE",
                headers: {'Authorization' : `Bearer ${token}`,},
            });
            setInventoryItems(inventoryItems.filter((i) => i._id !== id));
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
