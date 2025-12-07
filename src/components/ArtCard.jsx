import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function ArtCard({ artwork, onClick }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleLikeClick = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    return (
        <div
            className="card card-interactive"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div style={{
                position: 'relative',
                paddingTop: '75%',
                overflow: 'hidden',
                backgroundColor: 'var(--surface-alt)'
            }}>
                <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform var(--transition-slow)',
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)'
                    }}
                />

                {/* Like Button */}
                <button
                    onClick={handleLikeClick}
                    style={{
                        position: 'absolute',
                        top: 'var(--space-3)',
                        right: 'var(--space-3)',
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isLiked ? 'var(--rose)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        boxShadow: 'var(--shadow-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                        transform: isHovered ? 'scale(1)' : 'scale(0.9)',
                        opacity: isHovered || isLiked ? 1 : 0.8
                    }}
                    aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                    <Heart
                        size={16}
                        color={isLiked ? 'white' : 'var(--rose)'}
                        fill={isLiked ? 'white' : 'none'}
                    />
                </button>

                {/* Age Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: 'var(--space-3)',
                    left: 'var(--space-3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(4px)',
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    Age {artwork.age}
                </div>
            </div>

            {/* Content */}
            <div style={{
                padding: 'var(--space-5)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Title */}
                <h3 style={{
                    fontSize: '1.0625rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    lineHeight: 1.3,
                    marginBottom: 'var(--space-2)'
                }}>
                    {artwork.title}
                </h3>

                {/* Description */}
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    marginBottom: 'var(--space-4)',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {artwork.description}
                </p>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--border-light)'
                }}>
                    {/* Artist Info */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                    }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.75rem'
                        }}>
                            {artwork.artist.charAt(0)}
                        </div>
                        <span style={{
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                        }}>
                            {artwork.artist}
                        </span>
                    </div>

                    {/* Likes Count */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        color: 'var(--text-muted)',
                        fontSize: '0.8125rem'
                    }}>
                        <Heart size={14} fill="var(--rose)" color="var(--rose)" />
                        <span>{isLiked ? artwork.likes + 1 : artwork.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
