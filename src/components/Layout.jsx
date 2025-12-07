import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import UploadArtModal from './UploadArtModal';
import { useChildren } from '../hooks/useChildren';
import { useArtworks } from '../hooks/useArtworks';

export default function Layout() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const { children: childProfiles } = useChildren();
    const { addArtwork } = useArtworks();

    const handleUploadClick = () => {
        setIsUploadModalOpen(true);
    };

    const handleUpload = async (artworkData) => {
        await addArtwork(artworkData);
        setIsUploadModalOpen(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onUploadClick={handleUploadClick} />

            <Outlet />

            <Footer />

            <UploadArtModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUpload}
                childProfiles={childProfiles}
            />
        </div>
    );
}
