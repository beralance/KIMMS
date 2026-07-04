import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useSnackbar } from "./SnackbarContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const { cartItems } = useCart();
    const { user, token } = useAuth();
    const { showSnackbar } = useSnackbar();

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [auctionCheckout, setAuctionCheckout] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const total = checkoutItems.reduce(
            (sum, item) => sum + (item.productId?.price || 0),
            0
        );
        setTotalAmount(total);
    }, [checkoutItems]);

    const checkout = async () => {
        console.log('NO AUCTION CHECKOUT')
        if (!checkoutItems.length && !auctionCheckout) return;
        console.log('Auction Checkout', auctionCheckout)

        console.log('auction checkout', auctionCheckout)

        if (auctionCheckout.length > 0){
            if (auctionCheckout?.winner !== user.userId) {
                showSnackbar("This product can only be bought by the auction winner", "error");
                return;
            }
        }

        if (!user || !token) {
            showSnackbar("You must be logged in to checkout", "error");
            return;
        }

        const isAuction = auctionCheckout && Object.keys(auctionCheckout).length > 0;
        const productType = isAuction 
            ? [{ inventoryId: auctionCheckout?.inventoryId?._id }]
            : checkoutItems.map(item => ({productId: item.productId._id}))
        try {
            setIsProcessing(true);
            const orderResp = await axios.post(
                `${API_URL}/api/orders`,
                {
                    userId: user.userId,
                    products: productType,
                    auctionId: auctionCheckout._id || null,
                    orderType: isAuction ? 'auction' : 'fixed',
                    totalPrice: isAuction ? auctionCheckout.reservePrice : totalAmount,
                    finalPrice,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const order = orderResp.data;
            const amountInCentavos = Math.round(order.finalPrice * 100)

            const paymentResp = await axios.post(
                `${API_URL}/api/payment/create-checkout-session`,
                {
                    orderId: order._id,
                    amount: amountInCentavos,
                    productIds: order.products.map(p => p.productId),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const checkoutUrl = paymentResp.data.checkout_url;
            const sessionId = paymentResp.data.sessionId;

            if (checkoutUrl) {
                localStorage.setItem("pendingPurchase", JSON.stringify(order));
                localStorage.setItem('checkoutSessionId', JSON.stringify(sessionId))
                window.location.href = checkoutUrl;
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

    const codCheckout = async () => {
        if (!checkoutItems.length) return;
        if (!user || !token) {
            showSnackbar("You must be logged in to checkout", "error");
            return;
        }
        try {
            setIsProcessing(true);
            const res = await axios.post(
                `${API_URL}/api/checkout/cod`,
                { 
                    userId: user.userId, 
                    products: checkoutItems.map(item => ({productId: item.productId._id})),
                    orderType: 'fixed',
                    totalPrice: totalAmount,
                    finalPrice,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            showSnackbar(res.data.message || "Order placed successfully with COD.", "success");
             if (res.status === 201) {
                navigate('/success');
            } else {
                navigate('/cancel');
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            showSnackbar("COD checkout failed.", "error");
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
                codCheckout,
                setFinalPrice,
                auctionCheckout,
                setAuctionCheckout,
                finalPrice
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);
export default CheckoutContext;
