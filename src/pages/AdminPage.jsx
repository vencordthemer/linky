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
*Credits:
* - Firebase for authentication and database
* - Vencordthemer for coding the main app
* - Freepik for icons
* - YOU for using this app
*/

import React, { useState, useEffect } from 'react';
// Remove axios import
// import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LinkCreateForm from '../components/LinkCreateForm'; // Import the form
// Import Firestore functions
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    deleteDoc, // Import deleteDoc
    doc        // Import doc
} from "firebase/firestore";
import { db } from '../firebase'; // Import db instance
// TODO: Import LinkList component

const AdminPage = () => {
    const { user } = useAuth(); // Get user info (needed for fetching links)
    const [links, setLinks] = useState([]);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [errorLinks, setErrorLinks] = useState('');
    const [deletingId, setDeletingId] = useState(null); // State to track which link is being deleted

    // Fetch links from Firestore
    useEffect(() => {
        const fetchLinks = async () => {
            if (!user?.uid) { // Check for Firebase user uid
                setLoadingLinks(false);
                setErrorLinks('User not logged in.'); // Should be handled by ProtectedRoute, but good check
                return;
            }

            setLoadingLinks(true);
            setErrorLinks('');
            try {
                // Create a query against the 'links' collection
                const linksQuery = query(
                    collection(db, "links"),
                    where("userId", "==", user.uid), // Filter by the current user's ID
                    orderBy("createdAt", "desc") // Order by creation date, newest first
                );

                // Execute the query
                const querySnapshot = await getDocs(linksQuery);

                // Map the documents to an array of link objects
                const userLinks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setLinks(userLinks);
            } catch (err) {
                console.error('Error fetching links from Firestore:', err);
                setErrorLinks('Failed to load links.');
            } finally {
                setLoadingLinks(false);
            }
        };

        fetchLinks();
    }, [user]); // Re-run if user object changes

    // Callback function for the form to update the link list
    const handleLinkAdded = (newLink) => {
        // Add the new link optimistically or refetch
        // For simplicity, let's add optimistically (note: createdAt won't be accurate)
        setLinks(prevLinks => [newLink, ...prevLinks]);
        // TODO: Or trigger a refetch of the list for accurate data including timestamp
    };

    // Function to handle link deletion
    const handleDeleteLink = async (linkId) => {
        if (!linkId) return;
        // Confirm before deleting
        if (!window.confirm("Are you sure you want to delete this link?")) {
            return;
        }

        setDeletingId(linkId); // Set loading state for this specific button
        setErrorLinks(''); // Clear previous errors

        try {
            const linkDocRef = doc(db, "links", linkId);
            await deleteDoc(linkDocRef);
            
            // Update local state to remove the link
            setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));

        } catch (err) {
            console.error("Error deleting link:", err);
            setErrorLinks("Failed to delete link. Please try again.");
        } finally {
            setDeletingId(null); // Clear loading state for button
        }
    };

    // TODO: Add functions to handle link update/delete using Firestore

    return (
        <div>
            <h2 className="mb-4">Admin Dashboard</h2>
            <p className="mb-4 text-light">Welcome, {user?.profile?.username || user?.email || 'User'}!</p>

            <LinkCreateForm onLinkAdded={handleLinkAdded} />

            <hr className="mb-4 mt-4" />

            <h3 className="mb-3">Your Links</h3>
            {errorLinks && <p className="error-message">{errorLinks}</p>}
            {loadingLinks && <p>Loading links...</p>}
            {!loadingLinks && !errorLinks && (
                <div>
                    {links.length > 0 ? (
                        links.map(link => (
                            <div key={link.id} className="card mb-3 p-3"> 
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{link.title}</strong>
                                        <a 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-light d-block mt-1"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    {/* Delete Button */} 
                                    <button 
                                        onClick={() => handleDeleteLink(link.id)}
                                        className="btn btn-danger btn-sm" // Smaller danger button
                                        disabled={deletingId === link.id} // Disable only the button being clicked
                                        style={{ marginLeft: '1rem' }} // Add some space
                                    >
                                        {deletingId === link.id ? 'Deleting...' : 'Remove'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>You haven't added any links yet. Use the form above!</p>
                    )}
                </div>
            )}

            {/* TODO: Theme Selector Component */}
            {/* TODO: Settings Form Component */}
        </div>
    );
};

export default AdminPage; 
