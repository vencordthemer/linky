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
import { auth, db } from '../firebase'; // Import Firebase auth and db
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions and serverTimestamp

// Remove Axios-related code
// import axios from 'axios';
// const setAuthToken = ...

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Firebase user object or null
    const [loading, setLoading] = useState(true); // Still useful for initial auth check
    const [initialAuthDone, setInitialAuthDone] = useState(false); // Track initial auth check
    const navigate = useNavigate();

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch profile data from Firestore to combine with auth user
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUser({ ...firebaseUser, profile: userDocSnap.data() }); // Combine auth user and profile data
                } else {
                    // This case might happen if Firestore doc creation failed after signup
                    // Or if user signed in via Google before profile was created (handled in signInWithGoogle)
                    console.warn("Firestore user document not found for UID:", firebaseUser.uid);
                    setUser(firebaseUser);
                }
            } else {
                // User is signed out
                setUser(null);
            }
            setLoading(false);
            setInitialAuthDone(true); // Mark initial check as done
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Run only once on mount

    // Function to create/update Firestore user doc
    // Used in both email/pass signup and Google sign-in
    const createUserProfileDocument = async (firebaseUser, additionalData = {}) => {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            // Only create if it doesn't exist
            const { email, displayName } = firebaseUser;
            const username = additionalData.username || displayName || email.split('@')[0]; // Use provided username, display name, or part of email
            const createdAt = serverTimestamp(); // Use server timestamp

            try {
                await setDoc(userDocRef, {
                    username: username,
                    email: email,
                    createdAt: createdAt,
                    profile: {
                        theme: 'default',
                        // Add other default profile fields if needed
                        ...(additionalData.profile || {})
                    },
                    ...additionalData // Merge any other data like specific username
                });
            } catch (error) {
                console.error("Error creating user document in Firestore:", error);
                // Handle error appropriately, maybe sign out the user?
            }
        } else {
            // Optionally update existing document if needed (e.g., sync email)
            // console.log("User document already exists for:", firebaseUser.uid);
        }
    };

    const signup = async (username, email, password) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create Firestore document with the provided username
            await createUserProfileDocument(userCredential.user, { username });
            // onAuthStateChanged will handle setting user state and loading
            navigate('/admin');
            return { success: true };
        } catch (err) {
            console.error("Firebase Signup Error:", err.code, err.message);
            setLoading(false);
            return { success: false, error: mapFirebaseAuthError(err.code) };
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle setting user state and loading
            navigate('/admin');
            return { success: true };
        } catch (err) {
            console.error("Firebase Login Error:", err.code, err.message);
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

            // If it's a new user, create their Firestore profile document
            if (additionalUserInfo?.isNewUser) {
                await createUserProfileDocument(result.user);
            }
            // onAuthStateChanged will handle setting user state and loading
            navigate('/admin');
            return { success: true };
        } catch (err) {
            console.error("Firebase Google Sign-In Error:", err.code, err.message);
            // Handle specific Google Sign-In errors if needed (e.g., popup closed)
            if (err.code === 'auth/popup-closed-by-user') {
                setLoading(false); // Don't show generic error if user closed popup
                return { success: false, error: null }; // Indicate failure but no error message
            }
            setLoading(false);
            return { success: false, error: mapFirebaseAuthError(err.code) || 'Google Sign-In failed.' };
        }
    };

    const logout = async () => {
        // Only set loading if auth check is done, prevents flicker on initial load+logout
        if (initialAuthDone) {
            setLoading(true);
        }
        try {
            await signOut(auth);
            // onAuthStateChanged handles setting user to null
            navigate('/login');
        } catch (err) {
            console.error("Firebase Logout Error:", err.code, err.message);
            setLoading(false); // Ensure loading is false if logout fails
        }
    };

    // Helper to map Firebase error codes to user-friendly messages
    const mapFirebaseAuthError = (code) => {
        switch (code) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This user account has been disabled.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Invalid email or password.';
            case 'auth/email-already-in-use':
                return 'This email address is already in use.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/operation-not-allowed':
                return 'Sign-in method not enabled in Firebase console.';
            case 'auth/popup-closed-by-user':
                return 'Sign-in popup closed before completion.'; // Already handled, but good to map
            case 'auth/cancelled-popup-request':
                return 'Multiple sign-in popups opened. Please try again.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email address but different sign-in credentials.';
            default:
                return 'An unknown error occurred. Please try again.';
        }
    }

    // Note: isAuthenticated is now derived from user state
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user, // Firebase user object (or combined object)
            isAuthenticated,
            loading,
            signup,
            login,
            logout,
            signInWithGoogle // Export the new function
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
}; 