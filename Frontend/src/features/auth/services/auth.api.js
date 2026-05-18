import axios from "axios"

//This api caller is used to register the user via frontend of the website
export async function register({ username, email, password }) {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/regiter", {
            username,email,password
        }, {
            // "withcredentials" is used when we want to send the cookie with the request
            //In short it allows the server to access and set the cookie on its own
            withcredentials: true
        })
        return response.data
    } catch (err) {
        console.log("Error in registering the user:", err);
    }
}