// context/CheckoutContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useSnackbar } from "./SnackbarContext";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const { cartItems } = useCart();
    const { user, token } = useAuth();
    const { showSnackbar } = useSnackbar();

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    // Update checkout items and total whenever cart changes
    useEffect(() => {
        const total = checkoutItems.reduce(
            (sum, item) => sum + (item.productId?.price || 0),
            0
        );
        setTotalAmount(total);
    }, [checkoutItems]);

    // debugging

    const checkout = async () => {
        if (!checkoutItems.length) return;

        if (!user || !token) {
            showSnackbar("You must be logged in to checkout", "error");
            return;
        }

        try {
            setIsProcessing(true);
            // 1️⃣ Create an order first
            const orderResp = await axios.post(
                `${backend}/api/orders`,
                {
                    userId: user.userId,
                    products: checkoutItems.map(item => ({
                        productId: item.productId._id
                    })),
                    totalPrice: totalAmount,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const order = orderResp.data;

            // the console in here works, so the error is probably below
            console.log('this the data in order: ', order)
            
            // 2️⃣ Call payment controller to create PayMongo session
            const paymentResp = await axios.post(
                `${backend}/api/payment/create-checkout-session`,
                {
                    orderId: order._id,
                    amount: order.totalPrice,
                    productIds: order.products.map(p => p.productId),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('###### PAYMENT RESP: ', paymentResp)

            const checkoutUrl = paymentResp.data.checkout_url;
            const sessionId = paymentResp.data.sessionId;

            console.log('this is whats inside checkoutUrl: ', checkoutUrl)

            if (checkoutUrl) {
                localStorage.setItem("pendingPurchase", JSON.stringify(order));
                localStorage.setItem('checkoutSessionId', JSON.stringify(sessionId)) //add session id to local storage
                window.location.href = checkoutUrl; // redirect to PayMongo
            } else {
                console.error("No checkout_url returned:", paymentResp.data);
                showSnackbar("Failed to create checkout session.", "error");
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            showSnackbar("Could not create checkout session.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <CheckoutContext.Provider
            value={{
                checkoutItems,
                setCheckoutItems,
                totalAmount,
                isProcessing,
                checkout,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);
export default CheckoutContext;
