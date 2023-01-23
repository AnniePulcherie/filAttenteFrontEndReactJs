import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Formulaire from "./Formulaire";
import Nature from "./Nature";
import axios from "axios";
const Fichier = ()=> {
    const { register, handleSubmit } = useForm();
    const [listDossier, setListeDossier] =useState([]);
    const [dossier, setDossier] = useState('');
    const [listeNature,setListeNature] =useState([]);
    const [nature, setNature] = useState('');
    const [natureformulaire, setNatureFormulaire] = useState(null);
    const [formulaire, setFormulaire] = useState(null);
    const [btn, setBtn] =useState(null);
    const [ffile, setffile] =useState("")
    useEffect(()=>{
        getDossier();
        getNature();
        
    },[]);

    const getDossier = async()=>{
        const response = await axios.get('http://localhost:5000/dossier', {
        });
        setListeDossier(response.data);
        console.log(listDossier);
        console.log(response.data);
    }
    
    const handleChange =event=> {
       
       console.log(event.target.value);
        setDossier(event.target.value);
        console.log(dossier);
    };


    const getNature = async()=>{
        const response = await axios.get('http://localhost:5000/nature', {
        });
        setListeNature(response.data);
        console.log(listeNature);
        console.log(response.data);
    }
    
    const handleChangeNature =event=> {
       
       console.log(event.target.value);
        setNature(event.target.value);
        console.log(nature);
    };


    const onSubmit = async(e,data) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", data.file[0]);


        const res = await fetch("http://localhost:5000/upload-file", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
        alert(JSON.stringify(`${res.message}, status: ${res.status}`));
    };
    const [file, setFile] = useState([]);
    const handleInputChange=(e)=>{
        setFile(e.target.files[0]);
        console.log(file);
    }


    const submitOn= (e)=>{
        e.preventDefault();
        
        const data = new FormData();
        
            data.append('file', file);
    
            setffile(file.name);

        axios.post("http://localhost:5000/upload-file", {data,dossier,nature},)
        .then((e)=>{
            console.log(file);
            console.log(dossier);
            console.log(nature);
            axios.post("http://localhost:5000/fichier", {ffile,dossier,nature},)
            console.log("success")})
        .catch((err)=>console.log('erreur ',err))
    }
      
    return (
        <div className="hero has-background-grey-light is-fullheight is-fullwidth">
        <div className="hero-body">
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-4-desktop">
            <button onClick={()=>{setFormulaire(<Formulaire/>); getDossier(); setBtn(<button onClick={()=>{
                setFormulaire(null); setBtn(null);
            }}>Fermer</button>)}}>Creer un dossier</button>
            <button onClick={()=>{setNatureFormulaire(<Nature/>); getNature();setBtn(<button onClick={()=>{
                setNatureFormulaire(null); setBtn(null); getNature(); getDossier();
            }}>Fermer</button>)}}>Creer une nature </button>
            {formulaire}
            {natureformulaire}
            {btn}

            <h2>Dossier</h2>
            <Form.Select aria-label="Default select example"value={dossier} onChange={handleChange} >
                {listDossier.map((dos )=> (
                <option key={dos.id} value={dos.name}>
                    {dos.name}
                </option>
                ))}
            </Form.Select>

            <h2>Nature du fichier</h2>
            <Form.Select aria-label="Default select example"value={dossier} onChange={handleChangeNature} >
                {listeNature.map((dos )=> (
                <option key={dos.id} value={dos.name}>
                    {dos.name}
                </option>
                ))}
            </Form.Select>
            {/* <form onSubmit={()=>{handleSubmit(onSubmit)}}> */}
            {/* <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Multiple files input example</Form.Label>
                <Form.Control type="file" multiple onChange={handleInputChange}/>
            </Form.Group> */}
            <form onSubmit={submitOn}>
                <div className="forme-groupe files">
                    <label>Upload fichier</label>
                    <input type="file" onChange={handleInputChange} className="form-control"/>
                </div>
                <input type='submit' />
            </form>
            {/* <button>Submit</button> */}
            {/* </form> */}
            </div>
            </div>
            </div>
            </div>
        </div>
    );
}
export default Fichier;