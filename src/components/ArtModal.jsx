import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, Download, Gift } from 'lucide-react';

export default function ArtModal({ artwork, isOpen, onClose }) {
    const [isLiked, setIsLiked] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
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
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

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

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 'var(--space-4)',
                animation: 'fadeIn 0.2s ease'
            }}
            onClick={onClose}
        >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            <div
                style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-2xl)',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                    animation: 'slideUp 0.3s ease'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image Section */}
                <div style={{
                    flex: '1 1 50%',
                    position: 'relative',
                    backgroundColor: 'var(--surface-alt)',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 'var(--space-4)',
                            left: 'var(--space-4)',
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'all var(--transition-fast)'
                        }}
                        aria-label="Close modal"
                    >
                        <X size={18} color="var(--text-main)" />
                    </button>
                </div>

                {/* Content Section */}
                <div style={{
                    flex: '1 1 50%',
                    padding: 'var(--space-8)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                }}>
                    {/* Age Badge */}
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                        <span className="badge">Age {artwork.age}</span>
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-display)',
                        marginBottom: 'var(--space-4)',
                        color: 'var(--text-main)',
                        lineHeight: 1.3
                    }}>
                        {artwork.title}
                    </h2>

                    {/* Artist Info */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        marginBottom: 'var(--space-5)'
                    }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1rem'
                        }}>
                            {artwork.artist.charAt(0)}
                        </div>
                        <div>
                            <p style={{
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                fontSize: '0.9375rem'
                            }}>
                                {artwork.artist}
                            </p>
                            <p style={{
                                fontSize: '0.8125rem',
                                color: 'var(--text-muted)'
                            }}>
                                {artwork.likes} likes
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{
                        padding: 'var(--space-4)',
                        backgroundColor: 'var(--surface-alt)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--space-6)'
                    }}>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9375rem',
                            lineHeight: 1.6,
                            fontStyle: 'italic'
                        }}>
                            "{artwork.description}"
                        </p>
                    </div>

                    {/* Artwork Details */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 'var(--space-3)',
                        marginBottom: 'var(--space-6)'
                    }}>
                        {[
                            { label: 'Medium', value: artwork.medium },
                            { label: 'Theme', value: artwork.theme },
                            { label: 'Category', value: artwork.category },
                            { label: 'Style', value: artwork.style }
                        ].map((detail) => (
                            <div key={detail.label} style={{
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-light)'
                            }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '2px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.03em'
                                }}>
                                    {detail.label}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: 'var(--text-main)',
                                    textTransform: 'capitalize'
                                }}>
                                    {detail.value?.replace('-', ' ')}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Action Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 'var(--space-2)'
                    }}>
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className="btn"
                            style={{
                                flexDirection: 'column',
                                padding: 'var(--space-3)',
                                backgroundColor: isLiked ? 'rgba(236, 72, 153, 0.1)' : 'var(--surface-alt)',
                                color: isLiked ? 'var(--rose)' : 'var(--text-secondary)',
                                border: isLiked ? '1px solid var(--rose)' : '1px solid var(--border-light)'
                            }}
                        >
                            <Heart size={18} fill={isLiked ? 'var(--rose)' : 'none'} />
                            <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Like</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="btn"
                            style={{
                                flexDirection: 'column',
                                padding: 'var(--space-3)',
                                backgroundColor: 'var(--surface-alt)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-light)'
                            }}
                        >
                            <Share2 size={18} />
                            <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Share</span>
                        </button>

                        <button
                            onClick={handleDownload}
                            className="btn"
                            style={{
                                flexDirection: 'column',
                                padding: 'var(--space-3)',
                                backgroundColor: 'var(--surface-alt)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-light)'
                            }}
                        >
                            <Download size={18} />
                            <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Save</span>
                        </button>

                        <button
                            className="btn"
                            style={{
                                flexDirection: 'column',
                                padding: 'var(--space-3)',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                color: 'var(--accent-hover)',
                                border: '1px solid var(--accent)'
                            }}
                        >
                            <Gift size={18} />
                            <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Donate</span>
                        </button>
                    </div>

                    {/* Share Toast */}
                    {showShareToast && (
                        <div style={{
                            marginTop: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            backgroundColor: 'var(--secondary)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}>
                            Link copied to clipboard!
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    div[style*="flex-direction: row"] {
                        flex-direction: column !important;
                    }
                    div[style*="flex: 1 1 50%"] {
                        flex: none !important;
                        min-height: 250px !important;
                    }
                }
            `}</style>
        </div>
    );
}
