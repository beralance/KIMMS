// src/utils/fetchWithAuth.js
export const fetchWithAuth = async (url, { method = "GET", body, token }, logout) => {
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
        if (logout) logout();
        throw new Error("Session expired. Please login again.");
    }

    return res;
};
