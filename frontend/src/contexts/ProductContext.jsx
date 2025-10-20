// src/context/ProductContext.jsx
import { createContext, useState, useEffect, use } from "react";
import {useAuth} from '../contexts/AuthContext'
import {useSocket} from '../contexts/SocketContext'
export const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [newProducts, setNewProducts] = useState([])
    const API_URL = import.meta.env.VITE_API_URL;
    const INVENTORY_URL = `${API_URL}/api/inventory`;
    const {user, token} = useAuth()
    const socket = useSocket()

    useEffect(() => {
        if (!socket) return
        console.log('Products from CONTEXT', products)
        socket.on('serverMessage', (msg) => {
            console.log('Server says:', msg)
        })
        socket.on('postedProductDelete', (data) => {
            console.log('📢 Posted product ID removed', data.id)
            setProducts((prev) => prev.filter((p) => p._id !== data.id))
        })
        socket.on('productSold', (data) => {
            console.log('📢📢📢📢Data from server webhook', data)
            const productsToRemove = Array.isArray(data) ? data.map(d => d._id) : [];
            setProducts(prev => prev.filter(p => !productsToRemove.includes(p._id)));
        })
        
        if (!socket.emittedTestMessage) {
            socket.emit("testMessage", "Hello from client!");
            socket.emittedTestMessage = true;
        }

        return ()  => {
            socket.off('serverMessage')
            socket.off('postedProductDelete')
        }
    }, [])


    // Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`)
            const data = await res.json();

            const visibleProducts = user
                ? (user.role === 'admin' || user.role === 'staff')
                    ? data
                    : data.filter((product) => !product.isLocal || user.isLocal)
                : data;

            //console.log('VISIBLE PRODUCTS', visibleProducts)
            if (user) {
                console.log('IS USER LOCAL', user.isLocal);
            } else {
                console.log('Guest mode (no user)');
            }
            
            setProducts(visibleProducts);

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

    // POLLING: Product polling on new products
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await fetchProducts();
                await fetchNewProducts();
                console.log('🔄 Data REFETCHED from PRODUCT_CONTEXT')
            }
            catch (err) {
                console.error('Error fetching data:', err)
            }
        }

        fetchAllData()
        const timer = setInterval(fetchAllData, 15000);

        return () => clearInterval(timer)
    }, [user])

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
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to update product");
            }

            const updatedProduct = await res.json();

            // Safely update local state
            setProducts((prev) =>
                prev.map((p) => (p._id === id ? updatedProduct : p))
            );

            return updatedProduct; // optional: return if you want to handle it outside
        } catch (err) {
            console.error("Error updating product:", err.message);
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
            await fetchProducts()
            await fetchInventory()
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
