import React from 'react';
import { Link } from 'react-router-dom';
import { IoNotificationsOutline } from "react-icons/io5";
import { Drawer, ButtonToolbar, Button } from 'rsuite';
import { auth } from '../config/firebase'; 


const Navbar = () => {
  // Hooks rsuite pour l'ouverture du modal
  const [open, setOpen] = React.useState(false);

  // Fonction pour la deconnexion
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href='/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    // Navbar
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <p className="navbar-brand" >Book Website</p>
        {/* Rsuite pour l'ouverture du modal de l'historique */}
        <ButtonToolbar >
          <Button onClick={() => setOpen(true)}><IoNotificationsOutline size={30} /></Button>
        </ButtonToolbar>
        <Drawer size='xs' open={open} onClose={() => setOpen(false)}>
          <Drawer.Body>
            {/* L'historique */}
            <h2>Historique</h2>
            <p className='text-muted mt-4'><strong>* Pape à emprunté le livre Laravel</strong></p>
            <p className='text-muted mt-2'><strong>* Moha à emprunté le livre Javascript</strong></p>
            <p className='text-muted mt-2'><strong>* Test à emprunté le livre Bootstrap</strong></p>
          </Drawer.Body>
        </Drawer>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link link-info" to="/users">Voir les utilisateurs</Link>
            </li>
            {/* Deconnexion */}
            <li className="nav-item">
              <button className="nav-link link-danger btn btn-link" onClick={handleLogout}>Déconnexion</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
