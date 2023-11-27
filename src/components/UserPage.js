import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarUser from './NavbarUser';

const UserPage = () => {
  // Les hooks
  const [books, setBooks] = useState([]);
  const [emprunter, setEmprunter] = useState({});

  // Fonction pour emprunter un livre
  const handleEmprunterClick = (bookId, bookTitle) => {
    setEmprunter((prevStates) => ({
      ...prevStates,
      [bookId]: true,
    }));

    toast.success(`Vous avez emprunté le livre "${bookTitle}"`);

    const delai = 5000;

    setTimeout(() => {
      setEmprunter((prevStates) => ({
        ...prevStates,
        [bookId]: false,
      }));
    }, delai);
    

  setTimeout(() => {
    toast.info(`Vous avez rendu le livre "${bookTitle}"`);
  }, delai);
  };

  // Fetch des livres depuis firestore
  useEffect(() => {
    const fetchBooks = async () => {
      try {
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
            imageUrl: bookData.imageUrl,
          });
        });

        setBooks(booksData);
        console.log('Récupération réussie');
      } catch (error) {
        console.error('Erreur: ', error);
        console.log('Échec');
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <NavbarUser />
    <div className='container mt-5 pt-5'>
      <ToastContainer />

      <h2>User Page</h2>
      <div className="card-cnt">
        {/* Map des livres */}
        {books.map((book) => (
          <div key={book.id} className="crd">
            {book.imageUrl && (
              <img src={book.imageUrl} alt="Img" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
            )}
            <h3>{book.title}</h3>
            <p>Auteur: {book.author}</p>
            <p className="text-truncate">Description: {book.description}</p>
            <div className="">
              {/* Bouton pour emprunter */}
              <button
                className="btn btn-info p-1 me-2"
                onClick={() => handleEmprunterClick(book.id, book.title)}
                disabled={emprunter[book.id]}
              >
                Emprunter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default UserPage;