// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL;
// Generic helper for POST requests
const postRequest = async (url, payload) => {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
    }

    return res.json();
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
    return postRequest(`${API_URL}/api/auth/resend-code`, payload);
};
