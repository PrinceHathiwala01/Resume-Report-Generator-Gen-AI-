import {useContext} from "react";
import { AuthContext } from "../../auth/auth.context";
import { login,register,logout,getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context;
    
    const handelLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        }catch (err) {
            
        }finally {
            setLoading(false);
        }
    }

    const handelRegister = async ({ username, email, password }) => {
        setLoading(true);  
        try {
            const data = await register({ username, email, password });
        setUser(data.user);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    const handelLogout = async () => {
        setLoading(true);  
        try {
            const data = await logout();
            setUser(null);
        } finally {
             setLoading(false);
        }  
    }

    return { user, loading, handelLogin, handelRegister, handelLogout };
}
