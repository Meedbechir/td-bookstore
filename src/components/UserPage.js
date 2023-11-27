import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarUser from './NavbarUser';

const UserPage = () => {
  const [books, setBooks] = useState([]);
  const [emprunter, setEmprunter] = useState({});

  // Fonction pour récupérer le stock d'un livre depuis le localStorage
  const getStock = (bookId) => {
    const stockKey = `stock_${bookId}`;
    const stock = localStorage.getItem(stockKey);
    return stock ? parseInt(stock, 10) : 5; 
  };

  // Fonction pour mettre à jour le stock dans le localStorage
  const updateStock = (bookId, newStock) => {
    const stockKey = `stock_${bookId}`;
    localStorage.setItem(stockKey, newStock.toString());
  };

  const handleEmprunterClick = (bookId, bookTitle) => {
    const currentStock = getStock(bookId);

    if (currentStock > 0) {
      // Réduire le stock dans le localStorage
      const newStock = currentStock - 1;
      updateStock(bookId, newStock);

      setEmprunter((prevStates) => ({
        ...prevStates,
        [bookId]: true,
      }));

      toast.success(`Vous avez emprunté le livre "${bookTitle}"`);

      const delaiDisable = 8000;
      setTimeout(() => {
        setEmprunter((prevStates) => ({
          ...prevStates,
          [bookId]: false,
        }));
      }, delaiDisable);

      const delaiReturn = 9000;
      setTimeout(() => {
        toast.info(`Le livre "${bookTitle}" a été rendu`);
      }, delaiReturn);
    } else {
      toast.error(`Livre "${bookTitle}" non disponible. Stock épuisé.`);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'books');
        const booksSnapshot = await getDocs(booksCollection);
        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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
          {/* Filtre des livres non archivés */}
          {books
            .filter((book) => !book.archived) 
            .map((book) => (
              <div key={book.id} className="crd">
                {book.imageUrl && (
                  <img src={book.imageUrl} alt="Img" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
                )}
                <h3>{book.title}</h3>
                <p>Auteur: {book.author}</p>
                <p className="text-truncate">Description: {book.description}</p>
                <div className="">
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
