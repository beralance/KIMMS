// ACCOUNT DATA DEMO


// Predefined demo accounts
const DEMO_ACCOUNTS = [
    { email: "user@example.com", password: "user123", name: "John Doe", role: "user" },
    { email: "admin@example.com", password: "admin123", name: "Admin", role: "admin" },
];

// Save demo accounts to localStorage if not present
export const initializeAccounts = () => {
    if (!localStorage.getItem("accounts")) {
        localStorage.setItem("accounts", JSON.stringify(DEMO_ACCOUNTS));
    }
};

// Get all accounts
export const getAccounts = () => {
    initializeAccounts();
    return JSON.parse(localStorage.getItem("accounts")) || [];
};

// Add a new account
export const addAccount = (account) => {
    const accounts = getAccounts();
    accounts.push(account);
    localStorage.setItem("accounts", JSON.stringify(accounts));
};

// Find account by email & password
export const findAccount = (email, password) => {
    return getAccounts().find((acc) => acc.email === email && acc.password === password);
};

export const findAccountByEmail = (email) => {
    return getAccounts().find((acc) => acc.email === email)
}
