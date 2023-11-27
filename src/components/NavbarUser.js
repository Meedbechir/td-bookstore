import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase'; 


const Navbar = () => {

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
        <Link className="navbar-brand" to="/">Book Website</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
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
