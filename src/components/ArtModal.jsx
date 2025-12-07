import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { X, Heart, Share2, Download, Gift, TrendingUp } from 'lucide-react';
import { Button, Badge, Avatar } from './ui';
import DonationModal from './DonationModal';
import styles from './ArtModal.module.css';

export default function ArtModal({ artwork, isOpen, onClose }) {
    const [isLiked, setIsLiked] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
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
                                    onClick={handleDownload}
                                    className={styles.actionButton}
                                    aria-label="Download for Instagram or TikTok"
                                >
                                    <Download size={18} aria-hidden="true" />
                                    <span className={styles.actionLabel}>Save</span>
                                </button>

                                <button
                                    className={`${styles.actionButton}`} // Removed styles.donate to make it secondary to the Invest button
                                    aria-label="Invest in this child's future"
                                    onClick={() => setIsDonationModalOpen(true)}
                                    style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                                >
                                    <TrendingUp size={18} aria-hidden="true" />
                                    <span className={styles.actionLabel}>Invest</span>
                                </button>

                                <button
                                    className={`${styles.actionButton} ${styles.donate}`}
                                    aria-label="Order prints and merchandise"
                                    onClick={() => alert("KidzArt Print Shop coming soon! Pre-order custom mugs and t-shirts.")}
                                >
                                    <Gift size={18} aria-hidden="true" />
                                    <span className={styles.actionLabel}>Print Shop</span>
                                </button>
                            </div>

                            {/* Social Share Section - High Visibility for Viral Growth */}
                            <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--text-muted)',
                                    marginBottom: 'var(--space-3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Share with Family & Friends
                                </p>
                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                    {[
                                        {
                                            name: 'Facebook',
                                            icon: (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                                </svg>
                                            ),
                                            color: '#1877F2',
                                            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
                                        },
                                        {
                                            name: 'X',
                                            icon: (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            ),
                                            color: '#000000',
                                            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Checkout this masterpiece by ${artwork.artist} on KidzArt! 🎨`)}&url=${encodeURIComponent(window.location.href)}`
                                        },
                                        {
                                            name: 'LinkedIn',
                                            icon: (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            ),
                                            color: '#0A66C2',
                                            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
                                        }
                                    ].map((social) => (
                                        <button
                                            key={social.name}
                                            onClick={() => window.open(social.url, '_blank', 'width=600,height=400')}
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-3)',
                                                borderRadius: 'var(--radius-lg)',
                                                border: '1px solid var(--border-light)',
                                                backgroundColor: 'var(--surface)',
                                                color: social.color,
                                                cursor: 'pointer',
                                                transition: 'all var(--transition-fast)',
                                                fontWeight: '600',
                                                fontSize: '0.875rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = social.color;
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--surface)';
                                                e.currentTarget.style.color = social.color;
                                            }}
                                        >
                                            {social.icon} {social.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Donation Modal - Rendered Portal-like */}
                            <DonationModal
                                isOpen={isDonationModalOpen}
                                onClose={() => setIsDonationModalOpen(false)}
                                artistName={artwork.artist}
                            />

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
