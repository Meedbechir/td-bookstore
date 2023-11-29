import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const Books = () => {

  // Les Hooks
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    imageUrl: '',
    archived: false
  });

  // UseEffect pour la recuperation depuis firestore
  useEffect(() => {
    const fetchBooks = async () => {
      const booksCollection = collection(db, 'books');
      const booksSnapshot = await getDocs(booksCollection);
      const booksData = [];

      booksSnapshot.forEach((doc) => {
        const bookData = doc.data();
        booksData.push({
          id: doc.id,
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          archived: bookData.archived || false, 
        });
      });

      setBooks(booksData);
    };

    fetchBooks();
  }, []);

    // changement dans l'input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  // fermeture de modal 
  const handleCloseModal = () => {
    setShowModal(false);
    setNewBook({
      title: '',
      author: '',
      description: '',
    });
  };
  // Ouverture de modal 
  const handleShowModal = () => {
    setShowModal(true);
  };

    // Ouverture du modal pour les details
  const handleShowDetailsModal = (book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  // fermeture du modal pour les details
  const handleCloseDetailsModal = () => {
    setSelectedBook(null);
    setShowDetailsModal(false);
  };

  // Verification du champ Img
  const ImageUrl = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };
  

  // Fonction pour ajouter un livre

const handleAddBook = async () => {
  
  // Vérification des champs
  if (!newBook.title || !newBook.author || !newBook.description || !newBook.imageUrl) {
    toast.warning("Veuillez remplir tous les champs.");
    return;
  }

  if (!ImageUrl(newBook.imageUrl)) {
    toast.warning("L'URL de l'image n'est pas valide.");
    return;
  }


  try {
    const docRef = await addDoc(collection(db, 'books'), { ...newBook });

    // Stocker le stock initial dans le localStorage
    localStorage.setItem(`stock_${docRef.id}`, '5');

    setNewBook({
      title: '',
      author: '',
      description: '',
      imageUrl: '',
      archived: false
    });

    const bookData = {
      id: docRef.id,
      ...newBook
    };

    setBooks([...books, bookData]);
    setShowModal(false);
  } catch (error) {
    console.error('Erreur: ', error);
  }
};
  
  // Supression du livre 
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteDoc(doc(db, 'books', bookId));
    } catch (error) {
      console.error('Error', error);
    }

    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);
  };

  // Archivage
const handleArchive = async (bookId, newArchive, book) => {
  try {
    await updateDoc(doc(db, 'books', bookId), { archived: newArchive });
    setBooks((prevBooks) =>
      prevBooks.map((prevBook) =>
        prevBook.id === bookId ? { ...prevBook, archived: newArchive } : prevBook
      )
    );
    console.log('Succees')
    toast.success(`Le livre "${book.title}" a été ${
      newArchive ? 'archivé' : 'désarchivé'
    }.`);
  } catch (error) {
    console.error('Erreur :', error);
    console.log('Echec')
  }
};


  return (
    <>
   
            <Navbar />
    <div className='container mt-5 pt-5'>
      <ToastContainer />
      <h1>Liste des Livres</h1>
      <div className="mt-3 text-end">
        <button className="btn btn-primary" onClick={handleShowModal}>
          Ajouter
        </button>
      </div>
      {/* Modal d'ajout */}
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Ajouter un Livre
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Titre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="author" className="form-label">
                    Auteur
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    name="author"
                    value={newBook.author}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    name="description"
                    value={newBook.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="imageUrl" className="form-label">
                    URL de l'image
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    value={newBook.imageUrl}
                    onChange={handleInputChange}  
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseModal}
              >
                Annuler
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddBook}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    {/* Fin */}
    {/* Modal detail */}
      <div
        className={`modal fade ${showDetailsModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: showDetailsModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Détails du Livre
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseDetailsModal}
              ></button>
            </div>
            <div className="modal-body">
              {selectedBook && (
                <div>
                  <h5>{selectedBook.title}</h5>
                  <p>Auteur: {selectedBook.author}</p>
                  <p>Description: {selectedBook.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* fin */}

        {/* tableau qui affiche les livres */}
      <div className="row mt-4">
        <table className="table">
          <thead>
            <tr>
              {/* <th scope="col">ID</th> */}
              <th scope="col">Titre</th>
              <th scope="col">Auteur</th>
              <th scope="col">Description</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Map des livres */}
            {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.description}</td>
              {/* Les Actions  */}
              <td>
                {book.archived ? (
                  <button
                    className='btn btn-warning btn-sm'
                    onClick={() => handleArchive(book.id, !book.archived, book)}
                  >
                    Désarchiver
                  </button>
                ) : (
                  <>
                    <FaEye
                      color='blue'
                      size={25}
                      onClick={() => handleShowDetailsModal(book)}
                      style={{ cursor: 'pointer' }}
                    />
                    <FaTrash
                      color='red'
                      size={25}
                      onClick={() => handleDeleteBook(book.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <button
                      className='btn btn-warning btn-sm mt-1'
                      onClick={() => handleArchive(book.id, !book.archived, book)}
                    >
                      Archiver
                    </button>
                  </>
                )}
    </td>
  </tr>
))}
      </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default Books;
