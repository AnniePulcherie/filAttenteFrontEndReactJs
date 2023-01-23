/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState} from 'react'
import axios from 'axios';

const Role = () => {

    const [fonction,setFonction] = useState("");
    
    //----------------------------------ROLE: CREATION DE FONCTION---------------------
    const creerRole = async(e)=>{
        e.preventDefault();
        try {
            const role =  await axios.post('http://localhost:5000/role', {
                  name: fonction,   
              });
              console.log(role);
        }catch(error){
            console.log(error);
        }
    }
    
    return (
        <div className="container mt-5">
            <h1>Creer un fonction </h1>
           <form onSubmit={creerRole}>
                <div className="controls">
                        <label>Fonction</label>
                        <input type="text" className="input" name="fonction" placeholder="Fonction"
                        value={fonction} onChange={(e) => setFonction(e.target.value)} />
                </div>
                <div className="field mt-5">
                     <button className="button is-success is-fullwidth">Creer</button>
                </div>
           </form>   
        </div>
    )
}

export default Role
