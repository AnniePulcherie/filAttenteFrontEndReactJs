import { BrowserRouter, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ressources/style.css';
import Admin from "./components/dasboardUser/Admin";
import Secretaire from "./components/dasboardUser/Secretaire";
import Directeur from "./components/dasboardUser/Directeur";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Role from "./components/Role";
import  Fichier  from "./components/pages/Fichier";
import Action from "./components/Action";


function App() {
  const lienSecretaire =[
    {
      id:1,
      lien:"/secretaire",
      nomLien: "HOME"
    },
    {
      id:2,
      lien:"/fichier",
      nomLien: "FICHIER"
    }];

    const lienDirecteur =[
      {
        id:1,
        lien:"/directeur",
        nomLien: "HOME"
      },
      {
        id:2,
        lien:"/role",
        nomLien: "FONCTION"
      },];

      const lienAdmin =[
          {
            id:1,
            lien:"/dashboard",
            nomLien: "HOME"
          },
    {
      id:2,
      lien:"/action",
      nomLien: "ACTION"
    },
    {
      id:3,
      lien:"/register",
      nomLien: "USERS"
    },
   
    {
      id:4,
      lien:"/visiteur",
      nomLien: "VISITEUR",
    },
   
  ];

  
  return (
    <BrowserRouter>
      <Switch>
      <Route exact path="/role">
          <Role/>
        </Route>
        <Route exact path="/">
          <Login/>
        </Route>
        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/action">
          <Action/>
        </Route>
        <Route path="/dashboard">
          <Navbar listMenu= {lienAdmin} />
          <Admin />
        </Route>
        <Route path="/secretaire">
          <Navbar lien = "/fichier" menu = "FICHIER"/>
          <Secretaire/>
        </Route>
        <Route path="/fichier">
          <Navbar lien = "/fichier" menu = "FICHIER"/>
          <Fichier/>
        </Route>
        <Route path="/directeur">
          <Navbar lien="/action" menu="ACTION"/>
          <Directeur/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
