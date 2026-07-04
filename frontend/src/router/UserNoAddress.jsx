import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) return null;
    
    if (!user) return <Navigate to="/login" />;

    if (!user.verified) return <Navigate to="/verify" />;

    return children;
}
