import { useState, useEffect } from 'react';
import { artworks as mockArtworks } from '../data/mockData';

const STORAGE_KEY = 'kidzart_user_artworks';

export function useArtworks() {
    const [userArtworks, setUserArtworks] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load user artworks from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setUserArtworks(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load artworks:', e);
        }
        setIsLoaded(true);
    }, []);

    // Save user artworks to localStorage when they change
    useEffect(() => {
        if (isLoaded && userArtworks.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userArtworks));
            } catch (e) {
                console.error('Failed to save artworks:', e);
            }
        }
    }, [userArtworks, isLoaded]);

    // Combine mock artworks with user uploads and filter invalid images
    const allArtworks = [...userArtworks, ...mockArtworks].filter(art => art.imageUrl && art.imageUrl.trim() !== '');

    const addArtwork = (artwork) => {
        const newArtwork = {
            ...artwork,
            id: Date.now(),
            isUserUpload: true,
            uploadedAt: new Date().toISOString()
        };
        setUserArtworks(prev => [newArtwork, ...prev]);
        return newArtwork;
    };

    const updateArtwork = (id, updates) => {
        setUserArtworks(prev =>
            prev.map(art => art.id === id ? { ...art, ...updates } : art)
        );
    };

    const deleteArtwork = (id) => {
        setUserArtworks(prev => prev.filter(art => art.id !== id));
    };

    const getUserArtworks = () => userArtworks;

    const getArtworksByChild = (childId) => {
        return userArtworks.filter(art => art.childId === childId);
    };

    return {
        artworks: allArtworks,
        userArtworks,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        getUserArtworks,
        getArtworksByChild,
        isLoaded
    };
}
