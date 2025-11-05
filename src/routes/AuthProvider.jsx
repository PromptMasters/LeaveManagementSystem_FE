import { ChildCare } from "@mui/icons-material";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [userData, setUserData] = useState(null);
     const [authLoading, setAuthLoading] = useState(false);   // ❗ Cần thêm
    const [authError, setAuthError] = useState(null);  
    // const login = (userData) => setUserData(userData);
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8082";

    const login = async (userData) => {
        // setUserData(userData);

        setAuthLoading(true);
        setAuthError(null);
        const body={
            username: userData.username,
            password: userData.password
        }
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // nếu backend set cookie session, thêm:
                credentials: "include",
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                // 401/400 → sai thông tin
                const msg = res.status === 401 ? "Sai username hoặc password" : `Lỗi ${res.status}`;
                throw new Error(msg);
            }

            // Backend trả về object user info (vd: {id, username, fullName, roles, ...})
            const user = await res.json();

            setUserData(user);
            sessionStorage.setItem("userData", JSON.stringify(user));
            return { ok: true, user };
        } catch (e) {
            setAuthError(e.message || "Login failed");
            return { ok: false, error: e };
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = () => setUserData(null);

    return (
        <AuthContext.Provider value={{ userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}