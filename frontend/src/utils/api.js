const API_URL = import.meta.env.VITE_API_URL;
const postRequest = async (url, payload) => {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    let resData;
    try {
        resData = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null;
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
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.message || "Request failed");
    }
    return res.json();
};

export const updateUserProfile = async (userId, payload, token) => {
    const res = await fetch(`${API_URL}/api/auth/${userId}/profile`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    let resData;
    try {
        resData = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null;
    }

    if (!res.ok) {
        const errMsg = resData?.error || resData?.message || "Request failed";
        throw new Error(errMsg);
    }

    console.log("Profile updated: ", resData);
    return resData;
};

export const uploadUserAvatar = async (userId, file, token) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_URL}/api/auth/${userId}/avatar`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    let resData;
    try {
        resData = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null;
    }

    if (!res.ok) {
        const errMsg = resData?.error || resData?.message || "Request failed";
        throw new Error(errMsg);
    }

    console.log("Avatar uploaded: ", resData);
    return resData;
};

export const updateUserPassword = async (
    userId,
    currentPassword,
    newPassword,
    token
) => {
    const res = await fetch(`${API_URL}/api/auth/${userId}/password`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    let resData;
    try {
        resData = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null;
    }

    if (!res.ok) {
        const errMsg = resData?.error || resData?.message || "Request failed";
        throw new Error(errMsg);
    }

    console.log("Password updates: ", resData);
    return resData;
};

export const updateUserEmail = async (
    userId,
    currentPassword,
    newEmail,
    token
) => {
    const res = await fetch(`${API_URL}/api/auth/${userId}/email`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newEmail }),
    });

    let resData;
    try {
        resData = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null;
    }

    if (!res.ok) {
        const errMsg = resData?.error || resData?.message || "Request failed";
        throw new Error(errMsg);
    }

    console.log("Email updated:", resData);
    return resData;
};

export const verifyUpdatedEmail = async (userId, code, token) => {
    const res = await fetch(`${API_URL}/api/auth/${userId}/verify-email`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
    });

    let resData;
    try {
        resData = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null;
    }

    if (!res.ok) {
        const errMsg =
            resData?.error || resData?.message || "Verification failed";
        throw new Error(errMsg);
    }

    console.log("Email verification successful:", resData);
    return resData;
};

// Accept Terms & Conditions
export const acceptTerms = async (userId, token) => {
    const res = await fetch(`${API_URL}/api/auth/${userId}/accept-terms`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    let resData;
    try {
        resData = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        resData = null;
    }

    if (!res.ok) {
        const errMsg = resData?.error || resData?.message || "Request failed";
        throw new Error(errMsg);
    }

    console.log("Terms accepted:", resData);
    return resData;
};

export const forgotPassword = async (payload) => {
    return postRequest(`${API_URL}/api/auth/forgot-password`, payload);
};

export const resetPassword = async (payload) => {
    return postRequest(`${API_URL}/api/auth/reset-password`, payload);
};
