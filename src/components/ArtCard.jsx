import React from 'react';
import { Heart, Share2 } from 'lucide-react';

export default function ArtCard({ artwork, onClick }) {
    return (
        <div
            className="card"
            style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
            onClick={onClick}
        >
            <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
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
                        transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'white',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Heart size={18} color="var(--rose)" />
                </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        lineHeight: 1.2
                    }}>
                        {artwork.title}
                    </h3>
                    <span style={{
                        backgroundColor: 'var(--surface-alt)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--text-muted)'
                    }}>
                        Age {artwork.age}
                    </span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
                    {artwork.description}
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#78350F',
                            fontSize: '0.875rem'
                        }}>
                            {artwork.artist.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{artwork.artist}</span>
                    </div>

                    <button className="btn-outline" style={{
                        padding: '0.4rem',
                        borderRadius: '8px',
                        border: 'none',
                        color: 'var(--text-muted)'
                    }}>
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
