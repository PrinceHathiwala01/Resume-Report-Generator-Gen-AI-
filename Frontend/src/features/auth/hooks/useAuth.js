import {useContext} from "react";
import { AuthContext } from "../auth-state.context";
import { login,register,logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context;
    
    const handelLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data?.user ?? null);
            return data?.user ?? null;
        }finally {
            setLoading(false);
        }
    }

    const handelRegister = async ({ username, email, password }) => {
        setLoading(true);  
        try {
            const data = await register({ username, email, password });
            setUser(data?.user ?? null);
            return data?.user ?? null;
        } finally {
            setLoading(false);
        }
    }

    const handelLogout = async () => {
        setLoading(true);  
        try {
            await logout();
        } catch (error) {
            console.log("Logout request failed, clearing local session:", error);
        } finally {
            setUser(null);
             setLoading(false);
        }  
    }

    return { user, loading, handelLogin, handelRegister, handelLogout };
}
