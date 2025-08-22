import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    // Falls kein Token vorhanden → auf Login umleiten
    if (!token || token.trim() === "") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Falls du später eine echte Tokenprüfung mit dem Backend machst:
    // Hier könnte ein API-Call hin, um zu checken, ob der Token noch gültig ist.

    return children;
}
