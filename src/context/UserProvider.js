// import React from 'react'
import { useState } from 'react'
import { UserContext } from './UserContext'
import axios from "axios"

// const url = process.env.REACT_APP_API_URL
const url = "http://localhost:3001"

export default function UserProvider({children}) {
    const userFromSessionStorage = sessionStorage.getItem("user")
    const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage): {email: '', password:''})
    
    const signUp = async () => {
        const json = JSON.stringify(user)
        const headers = { headers: {'Content-Type': 'application/json'}}
        try {
            const response = await axios.post(url + "/user/register", json, headers)
            setUser({email:"", password:""})
            // setUser(response.data)
            sessionStorage.setItem("user", JSON.stringify(response.data))
        } catch(error) {
            throw error
        }
    }

    const signIn = async () => {
        const json = JSON.stringify(user)
        const headers = { headers: {'Content-Type': 'application/json'}}
        try {
            const response = await axios.post(url + "/user/login", json, headers)
            const token = response.data.token
            setUser(response.data)
            // setUser({ ...response.data, token });
            sessionStorage.setItem("user", JSON.stringify(response.data))
            // sessionStorage.setItem("user", JSON.stringify({ ...response.data, token }));
        } catch(error) {
            throw error
        }
    }
    

    return ( 
        <UserContext.Provider value = {{ user, setUser, signUp, signIn}} >
            { children }
        </UserContext.Provider>   
    )
}

    // const signUp = async () => {
    //     const json = JSON.stringify(user);
    //     const headers = { headers: { 'Content-Type': 'application/json' } };
    //     const url = process.env.REACT_APP_API_URL; // Ensure this is defined correctly
    //     const endpoint = `${url}/register`; // Construct the endpoint
    
    //     console.log("Requesting:", endpoint); // Log the endpoint
    //     try {
    //         const response = await axios.post(endpoint, json, headers); // Use the constructed endpoint
    //         console.log("Signup response:", response.data);
    //         setUser(response.data);
    //         sessionStorage.setItem("user", JSON.stringify(response.data));
    //     } catch (error) {
    //         console.error("Signup error:", error); // Log the error
    //         throw error;
    //     }
    // };
    


