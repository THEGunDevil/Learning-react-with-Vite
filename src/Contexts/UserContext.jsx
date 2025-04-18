import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../Components/Firebase/Firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (
    email,
    password,
    firstname,
    lastname,
    phone,
    address
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        firstname,
        lastname,
        email,
        uid: newUser.uid,
        createdAt: serverTimestamp(),
        phone,
        address,
      });

      setUser(newUser);

      toast.success("You have registered successfully!", {
        position: "top-center",
      });
      return newUser;
    } catch (error) {
      console.error(error);
      toast.error("Somthing went wrong.", { position: "bottom-center" });
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      toast.success("Signed in successfully.", { position: "top-center" });
      return userCredential.user;
    } catch (error) {
      console.error(error);
      toast.error("Signed in failed.", { position: "bottom-center" });
      throw error;
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message, { position: "bottom-center" });
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, register, signin, setUser, signout }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
}

export default UserProvider;
