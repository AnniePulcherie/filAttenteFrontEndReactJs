import React, { useState } from 'react';
import axios from 'axios';
const Nature = () => {
    const [name,setName] = useState('');
    const creerNature = async(e)=>{
        e.preventDefault();
       
        try {
            await axios.post('http://localhost:5000/nature', {name,});
            alert("Création de Nature de fichier avec succes");
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
                    <input type="text" className="input" placeholder="Name"
                        value={name} onChange={(e) => setName(e.target.value)} />
                </div>
            </div> 
            <button onClick={creerNature}>Creer</button>
        </div>
    );
};

export default Nature;