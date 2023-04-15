import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import App from '../Firebase/firebase.init';

export const AuthContext = createContext(null);

const auth = getAuth(App);
const googleAuthProvider = new GoogleAuthProvider();


export const AuthProvider = ({children}) => {

    const [user,setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    const createUser = (email,password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email,password) =>  {
        return signInWithEmailAndPassword(auth, email,password)
    }

    const signInWithGoogle = () =>{
        return signInWithPopup(auth, googleAuthProvider);
    }

    const logOut = () => {
        return signOut(auth);
    }


    // Observe auth state change
    useEffect(()=> {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            console.log('Auth State Changed', currentUser);
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            unSubscribe()
        }
    },[])

    const authInfo = {
        user,
        loading,
        createUser, 
        signIn,
        signInWithGoogle,
        logOut
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;