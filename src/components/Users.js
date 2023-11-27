import React, { useState, useEffect } from 'react';
import {  FaTrash } from 'react-icons/fa';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

const Users = () => {
  // Hook
  const [users, setUsers] = useState([]);

  // Recuperation des users 
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        usersData.push({
          id: doc.id,
          name: userData.name,
          email: userData.email,
        });
      });

      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  // supression de user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error', error);
    }

    const updatedBooks = users.filter((user) => user.id !== userId);
    setUsers(updatedBooks);
  };


  return (
    <div className='container'>
        <h1>Liste des users</h1>
        <p>
           <Link to='/dashboard'>Retour</Link>
        </p>
      <div className="row">
        <div className="mt-4">
          <table className='table'>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nom</th>
                <th scope="col">Email</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <FaTrash onClick={() => handleDeleteUser(user.id)} color='red' size={25} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
