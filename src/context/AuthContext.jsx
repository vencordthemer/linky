/*!
 * Linky - A Linktree Clone Built with Vite and Firebase
 * Copyright (c) 2025 Vencordthemer and contributors
 *
 * This project is open-source and licensed under the MIT License.
 * You can find the source code at: https://github.com/vencordthemer/linky
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * MIT License for more details.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    getAdditionalUserInfo
} from 'firebase/auth';
import { auth, db } from '../firebase';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialAuthDone, setInitialAuthDone] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUser({ ...firebaseUser, profile: userDocSnap.data() });
                } else {
                    console.warn('Firestore user document not found for UID:', firebaseUser.uid);
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
            setInitialAuthDone(true);
        });

        return () => unsubscribe();
    }, []);

    const createUserProfileDocument = async (firebaseUser, additionalData = {}) => {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            const { email, displayName } = firebaseUser;
            const username = additionalData.username || displayName || email.split('@')[0];
            const createdAt = serverTimestamp();

            try {
                await setDoc(userDocRef, {
                    username: username,
                    email: email,
                    createdAt: createdAt,
                    profile: {
                        theme: 'default',
                        ...(additionalData.profile || {})
                    },
                    ...additionalData
                });
            } catch (error) {
                console.error('Error creating user document in Firestore:', error);
            }
        }
    };

    const signup = async (username, email, password) => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setLoading(false);
                return { success: false, error: 'Username is already taken.' };
            
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await createUserProfileDocument(userCredential.user, { username });
            navigate('/admin');
            return { success: true };
        } catch (err) {
            console.error('Firebase Signup Error:', err.code, err.message);
            setLoading(false);
            return { success: false, error: mapFirebaseAuthError(err.code) };
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
            return { success: true };
        } catch (err) {
            console.error('Firebase Login Error:', err.code, err.message);
            setLoading(false);
            return { success: false, error: mapFirebaseAuthError(err.code) };
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalUserInfo = getAdditionalUserInfo(result);

            if (additionalUserInfo?.isNewUser) {
                await createUserProfileDocument(result.user);
            }
            navigate('/admin');
            return { success: true };
        } catch (err) {
            console.error('Firebase Google Sign-In Error:', err.code, err.message);
            if (err.code === 'auth/popup-closed-by-user') {
                setLoading(false);
                return { success: false, error: null };
            }
            setLoading(false);
            return { success: false, error: mapFirebaseAuthError(err.code) || 'Google Sign-In failed.' };
        }
    };

    const logout = async () => {
        if (initialAuthDone) {
            setLoading(true);
        }
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Firebase Logout Error:', err.code, err.message);
            setLoading(false);
        }
    };

    const mapFirebaseAuthError = (code) => {
        switch (code) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This user account has been disabled.';
            case 'auth/user-not-found':
                return 'No user found with this email address.';
            case 'auth/invalid-credential':
                return 'Invalid email or password.';
            case 'auth/email-already-in-use':
                return 'This email address is already in use.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/popup-closed-by-user':
                return 'Sign-in popup closed before completion.';
            case 'auth/cancelled-popup-request':
                return 'Multiple sign-in popups opened. Please try again.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email address but different sign-in credentials.';
            default:
                return 'An unknown error occurred. Please try again.';
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            signup,
            login,
            logout,
            signInWithGoogle
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
