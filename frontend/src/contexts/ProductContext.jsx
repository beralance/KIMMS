// src/context/ProductContext.jsx
import { createContext, useState, useEffect, use } from "react";
import {useAuth} from '../contexts/AuthContext'

export const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [newProducts, setNewProducts] = useState([])
    const API_URL = import.meta.env.VITE_API_URL;
    //const API_URL = "http://localhost:5000/api/products";
    const INVENTORY_URL = `${API_URL}/api/inventory`;
    const {user, token} = useAuth()

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`)
            const data = await res.json();
            console.log('Products from API: ', data)

            console.log('USER', user)
            const visibleProducts = user
                ? (user.role === 'admin' || user.role === 'staff')
                    ? data
                    : data.filter((product) => !product.isLocal || user.isLocal)
                : data;

            console.log('VISIBLE PRODUCTS', visibleProducts)
            if (user) {
                console.log('IS USER LOCAL', user.isLocal);
            } else {
                console.log('Guest mode (no user)');
            }
            

            setProducts(visibleProducts);
            console.log('!PRODUCTS', products)


        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    // Fetch available inventory (for posting)
    const fetchInventory = async () => {
        try {
            const res = await fetch(`${INVENTORY_URL}?status=available`,);
            const data = await res.json();
            setInventory(data);
        } catch (err) {
            console.error("Error fetching inventory:", err);
        }
    };
    
    // Fetch new products
    const fetchNewProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products/new`)
            const data = await res.json()

            const visibleNewProducts = user
                ? (user.role === 'admin' || user.role === 'staff')
                    ? data // admin/staff see everything
                    : data.filter((product) => !product.isLocal || user.isLocal)
                : data;

            setNewProducts(visibleNewProducts);
        }
        catch (err) {
            console.error('Error fetching newest products.')
        }
    }

    const addProduct = async (inventoryId) => {
        try {
            const res = await fetch(`${API_URL}/api/products`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization' : `Bearer ${token}`,
                },
                body: JSON.stringify({ inventoryId }),
            });
            const newProduct = await res.json();

            setProducts((prevProducts) => {
                if (prevProducts.some((p) => p.inventoryId === inventoryId)) return prevProducts;
                return [newProduct, ...prevProducts];
            });

            return newProduct;
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization' : `Bearer ${token}`,
                    
                },
                body: JSON.stringify(updatedData),
            });
            const updated = await res.json();
            setProducts(products.map((p) => (p._id === id ? updated : p)));
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    // Soft delete product
    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE"});
            const result = await res.json();
            setProducts(products.map((p) =>
                p._id === id ? { ...p, visibility: 'inactive' } : p
            ));
            console.log(result.message);
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    // Update product highlight
    const updateProductHighlight = async (id, highlight) => {
        const res = await fetch(`${API_URL}/api/products/highlight/${id}`, {
            method: "PATCH",
            headers: {
                    "Content-Type": "application/json"
                },
            body: JSON.stringify({ highlight }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update product highlight");
        setProducts((prev) => prev.map((p) => (p._id === id ? data : p)));
        return data;
    };

    // ProductContext.jsx
    // Add this function inside ProductProvider

    const updateProductStatus = async (productId, newStatus) => {
        try {
            // 1️⃣ Update product visibility
            const res = await fetch(`${API_URL}/api/products/${productId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    },
                body: JSON.stringify({ visibility: newStatus }),
            });
            const updatedProduct = await res.json();

            if (!res.ok) {
                return { error: updatedProduct.message || "Failed to update product status" };
            }

            // 2️⃣ Update linked inventory if status is sold
            if (newStatus === "sold") {
                await fetch(`${INVENTORY_URL}/${updatedProduct.inventoryId}/status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        },
                    body: JSON.stringify({ status: "sold" }),
                });
            }

            // 3️⃣ Update local state
            setProducts((prev) =>
                prev.map((p) => (p._id === productId ? updatedProduct : p))
            );

            return updatedProduct;
        } catch (err) {
            console.error(err);
            return { error: "Failed to update product status" };
        }
    };


    // Search products
    const searchProducts = async (query) => {
        try {
            const res = await fetch(`${API_URL}/api/products/search/query?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Error searching products:", err);
        }
    };

    // Increment product views
    const incrementViews = async (id) => {
        try {
            await fetch(`${API_URL}/api/products/views/${id}`, { method: "PATCH" });
        } catch (err) {
            console.error("Error incrementing views:", err);
        }
    };

    // Get product by ID
    const getProductById = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`)
            if (!res.ok) throw new Error('Failed to fetch product');
            return await res.json()
        }
        catch (err) {
            console.error('Error fetching product by id: ', err)
        }
    }


    useEffect(() => {
        fetchProducts();
        fetchProducts(user)
        fetchInventory();
        fetchNewProducts();
        fetchNewProducts(user);
    }, [user]);

    return (
        <ProductContext.Provider
            value={{
                products,
                inventory,
                newProducts,
                fetchProducts,
                fetchInventory,
                addProduct,
                updateProduct,
                deleteProduct,
                updateProductHighlight,
                updateProductStatus,  // ✅ new
                searchProducts,
                incrementViews,
                getProductById,
                fetchNewProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}
