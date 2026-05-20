import axios from "axios";

//This variable is used to remove the repeatative code from the api caller
//Basically it will set the baseURL and credential flag true for all the api caller
const api = axios.create({
    baseURL: "http://localhost:3000/",
    // "withcredentials" is used when we want to send the cookie with the request
            //In short it allows the server to access and set the cookie on its own
    withCredentials: true
})

//This api caller is used to register the user via frontend of the website
export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", {
            username,email,password
        })
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
        return response.data
    } catch (err)
    {
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
            return { user: null };
        }

        console.log("Unable to get the user details:", err);
        throw err;
    }
}
