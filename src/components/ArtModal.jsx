import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { X, Heart, Share2, Download, Gift } from 'lucide-react';
import { Button, Badge, Avatar } from './ui';
import styles from './ArtModal.module.css';

export default function ArtModal({ artwork, isOpen, onClose }) {
    const [isLiked, setIsLiked] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);
    const previousActiveElement = useRef(null);

    // Save focus and lock body scroll when modal opens
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            // Restore focus when modal closes
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, isOpen]);

    if (!isOpen || !artwork) return null;

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: artwork.title,
                    text: `Check out "${artwork.title}" by ${artwork.artist} on Kidzart!`,
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShowShareToast(true);
                setTimeout(() => setShowShareToast(false), 2000);
            }
        } catch (err) {
            console.log('Share cancelled');
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = artwork.imageUrl;
        link.download = `${artwork.title.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <FocusTrap active={isOpen}>
            <div
                className="animate-fade-in"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: 'var(--space-4)'
                }}
                onClick={handleBackdropClick}
            >
                <div
                    className="animate-modal"
                    style={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius-2xl)',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.modalContent}>
                        {/* Image Section */}
                        <div className={styles.imageSection}>
                            <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                className={styles.image}
                            />

                            {/* Close Button */}
                            <div className={styles.closeButton}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={X}
                                    onClick={onClose}
                                    aria-label="Close modal"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: 'var(--radius-full)',
                                        width: '40px',
                                        height: '40px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className={styles.contentSection}>
                            {/* Age Badge */}
                            <div style={{ marginBottom: 'var(--space-3)' }}>
                                <Badge variant="primary">Age {artwork.age}</Badge>
                            </div>

                            {/* Title */}
                            <h2 id="modal-title" className={styles.title}>{artwork.title}</h2>

                            {/* Artist Info */}
                            <div className={styles.artistInfo}>
                                <Avatar initials={artwork.artist.charAt(0)} size="md" />
                                <div className={styles.artistDetails}>
                                    <p className={styles.artistName}>{artwork.artist}</p>
                                    <p className={styles.artistLikes}>{artwork.likes} likes</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className={styles.descriptionBox}>
                                <p className={styles.description}>"{artwork.description}"</p>
                            </div>

                            {/* Artwork Details */}
                            <div className={styles.detailsGrid}>
                                {[
                                    { label: 'Medium', value: artwork.medium },
                                    { label: 'Theme', value: artwork.theme },
                                    { label: 'Category', value: artwork.category },
                                    { label: 'Style', value: artwork.style }
                                ].map((detail) => (
                                    <div key={detail.label} className={styles.detailItem}>
                                        <div className={styles.detailLabel}>{detail.label}</div>
                                        <div className={styles.detailValue}>
                                            {detail.value?.replace('-', ' ')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Spacer */}
                            <div className={styles.spacer} />

                            {/* Action Buttons */}
                            <div className={styles.actionsGrid} role="group" aria-label="Artwork actions">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
                                    aria-label="Like this artwork"
                                    aria-pressed={isLiked}
                                >
                                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} aria-hidden="true" />
                                    <span className={styles.actionLabel}>Like</span>
                                </button>

                                <button
                                    onClick={handleShare}
                                    className={styles.actionButton}
                                    aria-label="Share this artwork"
                                >
                                    <Share2 size={18} aria-hidden="true" />
                                    <span className={styles.actionLabel}>Share</span>
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className={styles.actionButton}
                                    aria-label="Download this artwork"
                                >
                                    <Download size={18} aria-hidden="true" />
                                    <span className={styles.actionLabel}>Save</span>
                                </button>

                                <button
                                    className={`${styles.actionButton} ${styles.donate}`}
                                    aria-label="Donate to support this artist"
                                >
                                    <Gift size={18} aria-hidden="true" />
                                    <span className={styles.actionLabel}>Donate</span>
                                </button>
                            </div>

                            {/* Share Toast */}
                            {showShareToast && (
                                <div className={styles.toast} role="status" aria-live="polite">
                                    Link copied to clipboard!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}

ArtModal.propTypes = {
    artwork: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
        description: PropTypes.string,
        likes: PropTypes.number,
        medium: PropTypes.string,
        theme: PropTypes.string,
        category: PropTypes.string,
        style: PropTypes.string
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
