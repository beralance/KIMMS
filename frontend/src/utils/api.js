// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL;
// Generic helper for POST requests
const postRequest = async (url, payload) => {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });


    let resData;
    try {
        resData = await res.json(); // parse once
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null; // fallback
    }


    if (!res.ok) {
        const errMsg = resData?.error || resData?.message || "Request failed";
        throw new Error(errMsg);
    }


    console.log("Server response data:", resData);
    return resData;
};


// Signup new user
export const signupUser = async (payload) => {
    return postRequest(`${API_URL}/api/auth/signup`, payload);
};

// Login existing user
export const loginUser = async (payload) => {
    return postRequest(`${API_URL}/api/auth/login`, payload);
};

// Verify email with code
export const verifyEmail = async (payload) => {
    return postRequest(`${API_URL}/api/auth/verify`, payload);
};

// Resend verification code
export const resendCode = async (payload) => {
    return postRequest(`${API_URL}/api/auth/resent-code`, payload);
};

// Add Update Address
export const updateUserAddress = async (userId, address, token) => {
    //wrap in try catch
     const res = await fetch(`${API_URL}/api/auth/${userId}/address`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({address}),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.message || "Request failed");
    }
    return res.json();
};
