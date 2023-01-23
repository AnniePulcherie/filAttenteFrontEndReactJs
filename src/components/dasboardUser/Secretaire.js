/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import StopWatch from '../StopWatch/StopWatch';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const Secretaire = () => {
    const [onEdit, setOnEdit] = useState(null);
    const [name, setName] = useState('');
    const [nameUser,setNameUser] =useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [visiteur, setVisiteur] = useState([]);
    const [users, setUsers] = useState([]);
    const history = useHistory();
    const [fonction,setFonction] = useState("");


    const [designation, setDesignation] = useState('');
    const [motif, setMotif] = useState('');
    const [msg, setMsg] = useState('');
    const [id,setId] = useState('');
    const [etat, setEtat] = useState('');
    const reference = useRef(null);
    const [dateR, setDateR] = useState("");
    const [update,setUpdate] = useState(false);
    let d = new Date();
    let date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

    useEffect(() => {
        refreshToken();
        getVisiteur();
        if(onEdit){
            reference.current = onEdit;
            setName(onEdit.name);
            setDesignation(onEdit.designation);
            setFonction(onEdit.fonction);
            setMotif(onEdit.motif);
            setId(onEdit.id);
            setDateR(date);
            setUpdate(true);   
            
        }
        etatVisiteur(name,dateR);

        socket.on("receive_message_directeur", (data)=>{
            alert(data.message);
            getVisiteur(); 
           
         });
         
    },[onEdit,socket]);
       
    let decision;
    const etatVisiteur = (nom, date)=>{
        if(decision === "entrer"){
            setEtat("entrer");
            Modifier();
            alert("entrer "+nom);
            

        }
        if(decision === "repporter"){
            setEtat("repporter");
            alert("le rendez vous est repporter au "+date);
        }
    }
    
//---------------------------------------------------
    const [message,setMessage] = useState("");
    
const sendMessage = (name)=>{
    socket.emit("send_message_secretaire", {message: name+ ' ' +message});
 }
//------------------------------------------------------

    const Modifier = async (e)=>{
        e.preventDefault();
        try{
            await axios.put('http://localhost:5000/visiteur/'+id, {
                designation,
                name,
                fonction,
                motif,
                etat,
                date,
                
            });
            getVisiteur();
            setMessage(" a été modifier");
            console.log(message);
            sendMessage(name,message);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
        setName("");
        setDesignation("");
        setFonction("");
        setMotif("");
        setOnEdit(null);
        setUpdate(!update);
    }
    
    const Register = async (e) => {
       
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/visiteur/ajouter', {
                designation,
                name,
                fonction,
                motif,
                date,
                
            });
            getVisiteur();
            setMessage(" vient d\'arriver");
            console.log(message);
            sendMessage(name,message);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
        setName("");
        setDesignation("");
        setFonction("");
        setMotif("");
        
       
    }

    const effacer = async (id)=>{
        try{
            await axios.delete('http://localhost:5000/visiteur/'+id);

            setMessage(" est partie");
            console.log(message);
            sendMessage(name,message);
            getVisiteur();
           
        }catch(error){
            
            console.log(error);
        }
      
    }

//token
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setNameUser(decoded.name);
            setFonction(decoded.fonction);
            setExpire(decoded.exp);

            console.log(decoded.fonction);
        } catch (error) {
            if (error.response) {
                history.push("/");
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUsers(decoded.name);
            setFonction(decoded.fonction);
            setExpire(decoded.exp);

            console.log(decoded.fonction);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // RECUPERER USER
    const getUsers = async () => {
        const response = await axiosJWT.get('http://localhost:5000/users', {
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
            <h1>Bienvenue {nameUser}  passe une bonne journée</h1>

            <Form onSubmit={update?Modifier:Register} ref={reference}>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column sm="2">
                   Designation
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type='"text'  value={designation} onChange={(e) => setDesignation(e.target.value)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                    Nom et Prénom
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                    Fonction
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder="Fonction" name='fonction' value={fonction} onChange={(e) => setFonction(e.target.value)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                   Motif de visite
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder="Motif" name='motif' value={motif} onChange={(e) => setMotif(e.target.value)}/>
                    </Col>
                </Form.Group>
                <button className="button is-success is-halfwidth">{update?"Update":"Insert"}</button>
             </Form>

        <div>
     <h1>Les visiteurs d'aujourd'hui</h1>
     <div className="container mt-5">
        <table className="table is-striped is-fullwidth">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Designation</th>
                    <th>Name</th>
                    <th>Fonction</th>
                    <th>Motif</th>
                    <th>Etat</th>
                    <th>Durée </th>
                    <th>Action</th>
                </tr>
            </thead>
        <tbody>
            { visiteur && visiteur.length>0?
            visiteur.map((visit, index) => (
            
                <tr key={visit.id}>
                    <td>{index + 1}</td>
                    <td>{visit.designation}</td>
                    <td>{visit.name}</td>
                    <td>{visit.fonction}</td>
                    <td>{visit.motif}</td>
                    <td>{visit.etat}</td>
                    <td><StopWatch /></td>
                    
                    <td><button onClick={()=>{setOnEdit(visit);}}>Update </button>
                    <button onClick={()=>{effacer(visit.id); getVisiteur();
                       }}>Delete
                    </button>
                    </td>
                    
                </tr>
            )):"Pas de visiteur jusqu'présent"}

        </tbody>
    </table>
   </div>
    </div>
    {/* </section> */}
            
        </div>
    )
}

export default Secretaire
