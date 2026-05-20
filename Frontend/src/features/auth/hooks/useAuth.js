import {useContext,useEffect} from "react";
import { AuthContext } from "../auth-state.context";
import { login,register,logout, getMe } from "../services/auth.api";

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
            setUser(null);
        } finally {
             setLoading(false);
        }  
    }

    useEffect(()=>{

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        getAndSetUser();

}, [])

    return { user, loading, handelLogin, handelRegister, handelLogout };
}
