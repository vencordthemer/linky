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
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Import Firestore functions
import {
    collection,
    query,
    where,
    limit,
    getDocs,
    orderBy
} from "firebase/firestore";
import { db } from '../firebase';
// TODO: Import LinkCard component
// TODO: Import theme styling

const UserProfilePage = () => {
    const { username } = useParams(); // Get username from URL
    const [userProfile, setUserProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError('');
            setUserProfile(null); // Reset state on new username
            setLinks([]);

            if (!username) {
                setError('No username provided.');
                setLoading(false);
                return;
            }

            try {
                // 1. Find the user document by username
                const usersRef = collection(db, "users");
                const userQuery = query(usersRef, where("username", "==", username), limit(1));
                const userQuerySnapshot = await getDocs(userQuery);

                if (userQuerySnapshot.empty) {
                    setError('User not found.');
                    setLoading(false);
                    return;
                }

                // Get user data and ID
                const userDoc = userQuerySnapshot.docs[0];
                const userData = userDoc.data();
                const userId = userDoc.id; // This is the user's UID
                setUserProfile(userData);

                // 2. Find links associated with that user ID
                const linksRef = collection(db, "links");
                const linksQuery = query(
                    linksRef,
                    where("userId", "==", userId),
                    orderBy("createdAt", "desc") // Or whatever order you prefer
                );
                const linksQuerySnapshot = await getDocs(linksQuery);

                const userLinks = linksQuerySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLinks(userLinks);

            } catch (err) {
                console.error('Error fetching profile data from Firestore:', err);
                setError('Error loading profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username]); // Re-fetch if username changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="container text-center mt-5 error-message">Error: {error}</div>;
    }

    if (!userProfile) {
        // This case should be covered by the error state now
        return <div className="container text-center mt-5">User not found.</div>;
    }

    // Apply theme based on userProfile.profile.theme
    const themeClass = `theme-${userProfile.profile?.theme || 'default'}`;
    // TODO: Define actual theme styles in CSS

    return (
        // Add theme class and basic structure
        <div className={`user-profile-page ${themeClass} container text-center`}>
             {/* Add profile picture/avatar here later */}
            <h1 className="mt-4 mb-3">{userProfile.username}</h1>
            {/* Display bio here later if added */}

            <div className="links-list mt-4">
                {links.length > 0 ? (
                    links.map((link) => (
                        // Use a card style for each link
                        <a 
                            key={link.id} // Use Firestore document ID as key
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-block mb-3" // Style as a block button
                        >
                           {link.title}
                        </a>

                    ))
                ) : (
                    <p className="text-light">This user hasn't added any links yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage; 
