/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import Role from '../Role';
import Register from '../Register';


export const Admin = () => {
    
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [visiteur, setVisiteur] = useState([]);
    const [users, setUsers] = useState([]);
    const history = useHistory();
    const [fonction,setFonction] = useState("");
    
    
    useEffect(() => {
        // refreshToken();
        getVisiteur();
        
    },[]);

   


//token
    // const refreshToken = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/token');
    //         setToken(response.data.accessToken);
    //         const decoded = jwt_decode(response.data.accessToken);
    //         setName(decoded.name);
    //         setFonction(decoded.fonction);
    //         setExpire(decoded.exp);

    //         console.log(decoded.fonction);
    //     } catch (error) {
    //         if (error.response) {
    //             history.push("/");
    //         }
    //     }
    // }

    // const axiosJWT = axios.create();

    // axiosJWT.interceptors.request.use(async (config) => {
    //     const currentDate = new Date();
    //     if (expire * 1000 < currentDate.getTime()) {
    //         const response = await axios.get('http://localhost:5000/token');
    //         config.headers.Authorization = `Bearer ${response.data.accessToken}`;
    //         setToken(response.data.accessToken);
    //         const decoded = jwt_decode(response.data.accessToken);
    //         setName(decoded.name);
    //         setFonction(decoded.fonction);
    //         setExpire(decoded.exp);

    //         console.log(decoded.fonction);
    //     }
    //     return config;
    // }, (error) => {
    //     return Promise.reject(error);
    // });

    // RECUPERER USER
    const getUsers = async () => {
        const response = await axios.get('http://localhost:5000/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    
        
    }
    

    const getVisiteur = async () => {
        const reponse = await axios.get('http://localhost:5000/visiteur', {
            headers: {
                Authorization: `Bearer ${token}`
            } 
        });
        console.log(reponse.data);
        setVisiteur(reponse.data);
    }
    
    return (
        <div className="container mt-5">
            <h1>Content de vous revoir</h1>
            
            <Role />
            <Register />
            
           
            
        </div>
    )
}

export default Admin
