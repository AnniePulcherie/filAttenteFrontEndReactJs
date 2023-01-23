import React, { useState } from 'react';
import axios from 'axios';
const Formulaire = () => {
    const [name,setName] = useState('');
    const creerDossier = async(e)=>{
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:5000/dossier', {name});
            console.log(name);
            alert("Creation de dossier avec succée");
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.msg);
            }
        }
    }
    return (
        <div>
           <div className="field mt-5">
                <label className="label">Name</label>
                <div className="controls">
                    <input type="text" className="input" placeholder="Nom du dossier"
                        value={name} onChange={(e) => {setName(e.target.value); console.log(name)}} />
                </div>
            </div> 
            <button onClick={creerDossier}>Creer</button>
        </div>
    );
};

export default Formulaire;