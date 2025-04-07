import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const LinkCreateForm = ({ onLinkAdded }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('You must be logged in to add links.');
            return;
        }

        if (!title || !url) {
            setError('Please provide both title and URL.');
            return;
        }

        // Basic URL validation (can be improved)
        try {
            new URL(url);
        } catch (_) {
            setError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        setLoading(true);

        try {
            // Add a new document with a generated ID to the 'links' collection
            const docRef = await addDoc(collection(db, "links"), {
                title: title,
                url: url,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });

            // Call the callback function passed from AdminPage
            if (onLinkAdded) {
                onLinkAdded({ id: docRef.id, title, url, userId: user.uid });
            }
            
            setTitle('');
            setUrl('');

        } catch (err) {
            console.error('Error creating link in Firestore:', err);
            setError('Failed to create link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="mb-3">Add New Link</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="mb-3">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Link Title"
                    required
                    disabled={loading}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="url">URL:</label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    disabled={loading}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Link'}
            </button>
        </form>
    );
};

export default LinkCreateForm; 