// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // your context

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) return null;
    
    if (!user) return <Navigate to="/login" />;

    // add isVerified in authContext to add in local storage
    if (!user.verified) return <Navigate to="/verify" />;

    return children;
}
