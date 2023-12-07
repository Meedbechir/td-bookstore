import React, { useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import image2 from "../assets/images/image2.png";

const Login = ({ setIsAuthenticated }) => {
  // Les hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // UseNavigate pour les redirections
  const navigate = useNavigate();

  // les changements dans les champs
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Fonction pour la connexion / login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      const isAdmin = email === "med@gmail.com" || email === "cheikh@gmail.com";

      setEmail("");
      setPassword("");
      setIsAuthenticated(true);

      if (isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/userpage");
      }
    } catch (error) {
      alert("Échec de la connexion. Veuillez vérifier vos informations.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const handleForgotPasswordEmailChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      alert(
        "Un e-mail de réinitialisation a été envoyé à votre adresse e-mail."
      );
      setForgotPasswordEmail("");
      handleCloseForgotPasswordModal();
    } catch (error) {
      alert(
        "Échec de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer."
      );
      console.error(error);
    }
  };

  return (
    // Formulaire
    <section className="vh-100">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Connexion
                    </p>
                    <form className="mx-1 mx-md-4" onSubmit={handleLogin}>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="form-outline flex-fill mb-0">
                          <label
                            className="form-label"
                            htmlFor="form3Example3c"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="form3Example3c"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="form-outline flex-fill mb-0">
                          <label
                            className="form-label"
                            htmlFor="form3Example4c"
                          >
                            Mot de passe
                          </label>
                          <input
                            type="password"
                            id="form3Example4c"
                            className="form-control"
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-md"
                          onClick={handleLogin}
                        >
                          {/* Loader */}
                          {loading ? (
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Chargement...
                              </span>
                            </div>
                          ) : (
                            "Se connecter"
                          )}
                        </button>
                      </div>
                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Vous n'avez pas de compte ?{" "}
                        <Link to="/" className="link-danger">
                          Inscrivez-vous
                        </Link>
                      </p>
                    </form>

                    {/*  */}

                    {/* Bouton "Mot de passe oublié" */}
                    <div className="mt-3 text-center">
                      <button
                        className="btn btn-danger "
                        onClick={handleForgotPassword}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>

                    {/* Modal Mot de passe oublié */}
                    {showForgotPasswordModal && (
                      <div
                        className="modal"
                        tabIndex="-1"
                        role="dialog"
                        style={{ display: "block" }}
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">
                                Mot de passe oublié
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseForgotPasswordModal}
                              ></button>
                            </div>
                            <div className="modal-body">
                              <form onSubmit={handleForgotPasswordSubmit}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="forgotPasswordEmail"
                                    className="form-label"
                                  >
                                    Adresse e-mail
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="forgotPasswordEmail"
                                    value={forgotPasswordEmail}
                                    onChange={handleForgotPasswordEmailChange}
                                    autoComplete="off"
                                    required
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Envoyer
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fin du Modal */}
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src={image2} className="img-fluid" alt="img" />
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

export default Login;
