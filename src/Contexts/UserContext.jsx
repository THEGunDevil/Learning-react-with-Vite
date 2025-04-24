import React, { createContext, useEffect, useState, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, firstname, lastname, phone, address) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const userData = {
        firstname,
        lastname,
        email,
        uid: newUser.uid,
        createdAt: serverTimestamp(),
        phone,
        address,
      };
      await setDoc(doc(db, 'users', newUser.uid), userData);

      setUser({ ...newUser, ...userData });

      toast.success('You have registered successfully!', {
        position: 'top-center',
      });
      return newUser;
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong.', { position: 'bottom-center' });
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      if (userData.createdAt && !userData.createdAt.toDate) {
        userData.createdAt = null;
      }

      setUser({ ...firebaseUser, ...userData });

      toast.success('Signed in successfully.', { position: 'top-center' });
      return firebaseUser;
    } catch (error) {
      console.error(error);
      toast.error('Signed in failed.', { position: 'bottom-center' });
      throw error;
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message, { position: 'bottom-center' });
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          if (userData.createdAt && !userData.createdAt.toDate) {
            userData.createdAt = null;
          }

          setUser({ ...firebaseUser, ...userData });
        } catch (error) {
          console.error('Error fetching Firestore data:', error);
          setUser({ ...firebaseUser, createdAt: null });
          toast.error('Failed to load user data.', { position: 'bottom-center' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ user, loading, register, signin, setUser, signout }),
    [user, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;