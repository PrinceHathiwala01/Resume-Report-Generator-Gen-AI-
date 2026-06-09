import axios from "axios";

const TOKEN_KEY = "authToken";

const BASE_URL =
    import.meta.env.MODE === "development" ?
        "http://localhost:3000"
    : "https://gen-ai-mg6q.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

export const clearStoredToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
    const token = getStoredToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

//This api caller is used to register the user via frontend of the website
export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", {
            username,email,password
        })
        setStoredToken(response.data?.token);
        return response.data
    } catch (err) {
        console.log("Error in registering the user:", err);
        throw err;
    }
}

//This api caller is used to login the user via frontend of the website
export async function login({email,password}) {
    try {
        const response = await api.post("/api/auth/login", {
            email,password
        })
        setStoredToken(response.data?.token);
        return response.data
    } catch (err) {
        console.log("Error in logging in the user:", err);
        throw err;
    }
}

//This api caller is used to logout the user via frontend of the website
export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        clearStoredToken();
        return response.data
    } catch (err)
    {
        clearStoredToken();
        console.log("Unable to logout the user:", err);
        throw err;
    }
}

//This api caller is used to get the user details who is loged-in
export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        if (err.response?.status === 401) {
            clearStoredToken();
            return { user: null };
        }

        console.log("Unable to get the user details:", err);
        throw err;
    }
}
