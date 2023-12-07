import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarUser from "./NavbarUser";

const UserPage = () => {
  const [books, setBooks] = useState([]);
  const [livresEmpruntes, setLivresEmpruntes] = useState([]);

  // Recup des livres depuis firestore
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, "books");
        const booksSnapshot = await getDocs(booksCollection);
        const booksData = booksSnapshot.docs.map((doc) => {
          const bookData = doc.data();
          return {
            id: doc.id,
            ...bookData,
            stock: bookData.stock || 5,
          };
        });

        setBooks(booksData);
        console.log("Récupération réussie");
      } catch (error) {
        console.error("Erreur: ", error);
        console.log("Échec");
      }
    };
    fetchBooks();
  }, []);

  // Emprunter
  const handleEmprunterClick = async (bookId, bookTitle) => {
    try {
      const bookRef = doc(db, "books", bookId);
      const bookDoc = await getDoc(bookRef);

      if (bookDoc.exists()) {
        const stockInitial = bookDoc.data().stock;

        if (stockInitial > 0) {
          await updateDoc(bookRef, { stock: stockInitial - 1 });

          
          setLivresEmpruntes((livres) => [...livres, bookId]);

          toast.success(`Vous avez emprunté le livre "${bookTitle}"`);
        } else {
          toast.error(`Livre "${bookTitle}" non disponible. Stock épuisé.`);
        }
      }
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  // Rendre
  const handleRendreClick = async (bookId, bookTitle) => {
    try {
      const bookRef = doc(db, "books", bookId);
      const bookDoc = await getDoc(bookRef);

      if (bookDoc.exists()) {

        const stockInitial = bookDoc.data().stock;
        
        await updateDoc(bookRef, { stock: stockInitial + 1 });
        setLivresEmpruntes((livres) => livres.filter((livre) => livre !== bookId));

        toast.info(`Vous avez rendu le livre "${bookTitle}"`);
      }
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  return (
    <>
      <NavbarUser />
      <div className="container userpage mt-5 pt-5">
        <ToastContainer />
        <h2>User Page</h2>
        <div className="card-cnt">
          {books
            .filter((book) => !book.archived)
            .map((book) => (
              <div key={book.id} className="crd">
                {book.imageUrl && (
                  <img
                    src={book.imageUrl}
                    alt="Img"
                    style={{ maxWidth: "100%", maxHeight: "70vh" }}
                  />
                )}
                <h3>{book.title}</h3>
                <p>Auteur: {book.author}</p>
                <p className="text-truncate">Description: {book.description}</p>
                <div className="">
                  <button
                    className="btn btn-info p-1 me-2"
                    onClick={() => handleEmprunterClick(book.id, book.title)}
                    disabled={livresEmpruntes.includes(book.id)}
                  >
                    Emprunter
                  </button>
                  <button
                    className="btn btn-success p-1"
                    onClick={() => handleRendreClick(book.id, book.title)}
                    disabled={!livresEmpruntes.includes(book.id)}
                  >
                    Rendre
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
