import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import image1 from '../assets/images/image1.png';


const Register = ({ setIsAuthenticated }) => {
  // Les hooks
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // UseNavigate pour les redirections
  const navigate = useNavigate();

  // les changements dans les champs

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // La fonction pour l'inscription
  const handleRegistration = async (e) => {
    e.preventDefault();

    // Verification des mdp

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        email: email,
        userId: user.uid,
        name: name
      });
      
      // verfi de l'authentification et la navigation
      setIsAuthenticated(true);
      navigate('/login');

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      alert(err.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    // Le formulaire
    <section className="vh-100">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Inscription</p>
                    <form className="mx-1 mx-md-4" onSubmit={handleRegistration}>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="form-outline flex-fill mb-0">
                        <label className="form-label" htmlFor="form3Example1c">Nom</label>
                          <input
                            type="text"
                            id="form3Example1c"
                            className="form-control"
                            value={name}
                            onChange={handleNameChange}
                            autoComplete='off'
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        
                        <div className="form-outline flex-fill mb-0">
                        <label className="form-label" htmlFor="form3Example3c">Email</label>
                          <input
                            type="email"
                            id="form3Example3c"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                            autoComplete='off'
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        
                        <div className="form-outline flex-fill mb-0">
                        <label className="form-label" htmlFor="form3Example4c">Mot de passe</label>
                          <input
                            type="password"
                            id="form3Example4c"
                            className="form-control"
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete='off'
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        
                        <div className="form-outline flex-fill mb-0">
                        <label className="form-label" htmlFor="form3Example4cd">Confirmation de Mdp</label>
                          <input
                            type="password"
                            id="form3Example4cd"
                            className="form-control"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            autoComplete='off'
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button type="submit" className="btn btn-primary btn-md" onClick={handleRegistration}>

                        {/* Le loader */}
                    {loading ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                    ) : (
                      'S\'inscrire'
                    )}
                  </button>

                      </div>
                      <p className="small fw-bold mt-2 pt-1 mb-0">Vous avez un compte ? <Link to="/login" className="link-danger">Connectez-vous</Link></p>

                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src={image1}
                      className="img-fluid"
                      alt="img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
