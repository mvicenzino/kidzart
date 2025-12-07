import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kidzart_children';

export function useChildren() {
    const [children, setChildren] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setChildren(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load children from storage:', e);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when children change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(children));
            } catch (e) {
                console.error('Failed to save children to storage:', e);
            }
        }
    }, [children, isLoaded]);

    const addChild = (child) => {
        setChildren(prev => [...prev, { ...child, artworkCount: 0 }]);
    };

    const editChild = (updatedChild) => {
        setChildren(prev =>
            prev.map(child =>
                child.id === updatedChild.id ? { ...child, ...updatedChild } : child
            )
        );
    };

    const deleteChild = (childId) => {
        if (window.confirm('Are you sure you want to delete this profile?')) {
            setChildren(prev => prev.filter(child => child.id !== childId));
        }
    };

    const getChildById = (childId) => {
        return children.find(child => child.id === childId);
    };

    const incrementArtworkCount = (childId) => {
        setChildren(prev =>
            prev.map(child =>
                child.id === childId
                    ? { ...child, artworkCount: (child.artworkCount || 0) + 1 }
                    : child
            )
        );
    };

    return {
        children,
        isLoaded,
        addChild,
        editChild,
        deleteChild,
        getChildById,
        incrementArtworkCount
    };
}
