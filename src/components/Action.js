/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState} from 'react'
import axios from 'axios';

const Action = () => {

    const [name,setName] = useState("");
    
    //----------------------------------ROLE: CREATION DE FONCTION---------------------
    const creerEtat = async(e)=>{
        e.preventDefault();
        try {
            const etat =  await axios.post('http://localhost:5000/action', {
                  etat: name,   
              });
              console.log(etat);
        }catch(error){
            console.log(error);
        }
    }
    
    return (
        <div className="container mt-5">
            <h1>Creer une Action </h1>
           <form onSubmit={creerEtat}>
                <div className="controls">
                        <label>Action</label>
                        <input type="text" className="input" name="etat" placeholder="etat"
                        value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="field mt-5">
                     <button className="button is-success is-fullwidth">Creer</button>
                </div>
           </form>   
        </div>
    )
}

export default Action
