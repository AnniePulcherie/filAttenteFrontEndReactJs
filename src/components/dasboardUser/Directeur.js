/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Link, useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Action from '../Action';
import io from 'socket.io-client';
import { get } from 'react-hook-form';


const socket = io.connect('http://localhost:5000');

const Directeur = () => {
    const [start, setStart]=useState(false);
    const[etat, setEtat] = useState("");
    const [idUser, setIdUser] =useState("");
    const [id,setId] = useState(0);
    const [date, setDate] = useState(new Date());
    const [name, setName] = useState('');
    const [nameVisiteur, setNameVisiteur] = useState('');


    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [visiteur, setVisiteur] = useState([]);
    const [action, setAction] =useState(null);
    const [users, setUsers] = useState([]);
    const history = useHistory();
    const [fonction,setFonction] = useState("");
    
    const [calendrier, setClendrier] = useState(null);
    const [btn, setBtn] = useState(null);
    const [decision, setDecision] = useState("Attendre");
    const [onEdit, setOnEdit] = useState(null);
   
    const [listAction, setListAction] = useState([]);
    const [idSelectionner, setIdSelectionner]= useState("");
    const [reunion, setReunion]= useState(false);
    let eniditra ;
    let enivoaka;


    useEffect(() => {
       
        refreshToken();
        getVisiteur(); 
        getAction();
         if(onEdit){
         setId(onEdit.id);
         } 
         socket.on("receive_message_secretaire", (data)=>{
            alert(data.message);
            getVisiteur(); 
        
         });

         if(start){
            
         }
       
    },[socket]);

//------------------------------------------------

//---------------------------------------------------
const sendMessage = (etat,date, name)=>{
    socket.emit("send_message_directeur", {message: etat +'  '+date+ ' '+name});
 }

//---------------------------------------------------------
   
    const onChange = async(date) =>{
        setDate(date);
       console.log(date);
      
    }
 
    const ok =async(id,date,etat, name)=>{
        console.log(date);
        setNameVisiteur(name)
     let   daty = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        try{
            await axios.put('http://localhost:5000/visiteur/'+id, {
               etat:etat,
               date:daty,
                
            });
            console.log(date);
            getVisiteur();
            sendMessage(etat,daty,name);
            setClendrier(null);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.msg);
            }
        }
           
    }
   

//token
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setIdUser(decoded.userId);
            setFonction(decoded.fonction);
            setExpire(decoded.exp);

            console.log(idUser);
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
            setName(decoded.name);
            setIdUser(decoded.userId);
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

    const getAction = async() =>{
        const response = await axios.get('http://localhost:5000/action', {
        });
        setListAction(response.data);
        console.log(listAction);
        console.log(response.data);
    }

//=++++++++++++++++++++++++++++++++++++++++++++ACTION VISITEUR+++++++++++++++++++++++


//++++++++++++++++++++++++++++++++entrerVisiteur++++++++++++++++++++++++++++++

const entrerVisiteur = async(id,action,name)=>{
    try{
        await axios.put('http://localhost:5000/visiteur/'+id, {
           etat:"En cours",
            
        });
        sendMessage(action,name,'');
        eniditra = date.toLocaleTimeString("en-US");
        console.log(eniditra);
        setReunion(true);
        setStart(true);
        //if(id === idSelectionner){
          
      //  }
       console.log("id visiteur",id);
       console.log("id selectionner",idSelectionner)
        

    } catch (error) {
        if (error.response) {
            console.log(error.response.data.msg);
        }
    }
}

//++++++++++++++++++++++++++++++++patienterVisiteur++++++++++++++++++++++++++++++++++++++++

const patienterVisiteur = async(id,action,name)=>{
    setDecision("attendre");
    try{
        await axios.put('http://localhost:5000/visiteur/'+id, {
           etat:"En attente",
            
        });
       
        sendMessage(action,name,'');
        console.log(date);
       
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.msg);
        }
    }
}

//++++++++++++++++++++++++++reporterVisiteur++++++++++++++++++++++++

const reporterVisiteur = async(id,action,name)=>{
    setDecision("reporter");
    setClendrier(<Calendar value={date} onChange={onChange} />)
            setEtat(action);
            setId(id);
            setName(name);

}
//+++++++++++++++++++++++++++VISITEUR PART ++++++++++++++++++++++++++
const visiteurSorte = async(id,eniditra,name)=>{
    setDecision("recu");
    let   daty = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    // e.preventDefault();
        console.log(daty);
         enivoaka =date.toLocaleTimeString("en-US");
        console.log(enivoaka);
        console.log(eniditra)
       console.log( idUser);
    //    setAction(null);
       setReunion(false);
       sendMessage("Reçu",daty,name);

       try{
        await axios.put('http://localhost:5000/visiteur/'+id, {
           etat:"Reçu",
            date: "22/11/2022",
        });
       
        sendMessage(action,name,'');
        console.log(date);
       getVisiteur();
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.msg);
        }
    }


    // try {
    //     await axios.post('http://localhost:5000/reception', {
    //         visiteurId:id,
    //         heureEntrer: eniditra,
    //         heureSortie: enivoaka,
    //         date:daty,
    //         userId: idUser,
    //     });
    //     console.log(name);
    //     setReunion(false);
        
    // } catch (error) {
    //     if (error.response) {
    //         console.log(error.response.data.msg);
    //     }
    // }
    
} 
   
    const updateEtat = async()=>{
        console.log(id);
        console.log(action);
        setName(name);
        if(action ==="Entrer"){
           
        }else if(action ==="Attendre"){
           
        }else if(action ==="Sortie"){
               
        }else
            {
            
        }
    getVisiteur();
}


// ++++++++++++++++++++++++++++++++++++++++++++++++FIN SORTIE VISITEUR+++++++++++++++++++++++++++++++
    return (
        <div className="container mt-5">
            <h1>Welcome Back: {name}</h1>
            <h1> {fonction}</h1>
           
           {/* <nav>
            <Link  to= "/action" className='navbar-item'>ACTION </Link>
           </nav>
            */}
                              
                             
       
            <button onClick={getVisiteur} className="button is-info">Get visiteur</button>
         
            <div>
           <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Designation</th>
                        <th>Name</th>
                        <th>Fonction</th>
                        <th>Motif</th>
                        <th>Etat</th>
                        <th>Action</th>
                    </tr>
                </thead> 
                <tbody>
                     {visiteur.map((visit,index) => (
                    
                        <tr key={visit.id}  id={decision} >
                            <td>{index + 1}</td>
                            <td>{visit.designation}</td>
                            <td>{visit.name}</td>
                            <td>{visit.fonction}</td>
                            <td>{visit.motif}</td>
                            <td>{visit.etat}</td>
                            
                            <td>
                            {   visiteur && visiteur.length>0?
                            listAction.map((action )=> (
                                        <button className="button is-info" key={action.id} onClick={()=>{
                                            if(reunion ===false){
                                                if(action.name === "Entrer"){
                                                    entrerVisiteur(visit.id, action.name, visit.name)
                                                    setAction(<button onClick={()=>
                                                        {visiteurSorte(visit.id,eniditra,visit.name)}}>Sortir</button>);
                                                     
                                                }else if(action.name === "Attendre"){
                                                    patienterVisiteur(visit.id, action.name, visit.name)
                                                }if(action.name === "Reporter"){
                                                    reporterVisiteur(visit.id, action.name,visit.name)
                                                }
                                                
                                            } else {setId(visit.id); 
                                            setIdSelectionner(visit.id); 
                                             console.log("id selected",idSelectionner)
                                            const anarana = visit.name
                                            alert("il y a encore un visiteur  avec vous ")}}}>
                                            {action.name}
                                        </button>
                                        
                                        
                                        )):"Pas de visiteur jusqu'présent"}

                                     {/* <button onClick={()=>{
                                        if(reunion ===false){
                                        entrerVisiteur(visit.id,"Entrer",visit.name)
                                        setAction(<button onClick={()=>
                                            {visiteurSorte(id,eniditra,name)}}>Sortir</button>);
                                         } else {setId(visit.id);   
                                             
                                                alert(`${visit.name} est encore avec vous `)}}}
                                    >Entrer</button>   
                                     <button onClick={()=>patienterVisiteur(visit.id,"Attendre",visit.name)}>Attendre</button>   
                                     <button onClick={()=>reporterVisiteur(visit.id,"Reporter")}>Reporter</button>    */}
                                       
                           
                            </td>
                        </tr>
                        
                    ))}


                </tbody>
            </table>
            {action}
            <div className='calendar-container'>
            {calendrier}
            </div>
          
             {console.log(date)}
             {/* {setDateDeRepport(date)} */}
            <button onClick={ ()=>ok(id,date,etat, name)}>Ok</button>
           
        </div>
          
        </div>
    )
}

export default Directeur
