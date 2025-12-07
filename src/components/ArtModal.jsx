import React, { useState } from 'react';
import { X, Heart, Share2, Gift, DollarSign, Sparkles, Printer, Download, ShoppingCart } from 'lucide-react';

export default function ArtModal({ artwork, isOpen, onClose }) {
    const [donateAmount, setDonateAmount] = useState(5);
    const [showDonateSuccess, setShowDonateSuccess] = useState(false);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('donate');

    if (!isOpen || !artwork) return null;

    const donateOptions = [1, 5, 10, 25];

    const printOptions = [
        { size: '8x10"', price: 15 },
        { size: '11x14"', price: 25 },
        { size: '16x20"', price: 40 },
        { size: '24x36"', price: 65 }
    ];

    const handleDonate = () => {
        setShowDonateSuccess(true);
        setTimeout(() => setShowDonateSuccess(false), 3000);
    };

    const handleOrderPrint = (option) => {
        setShowOrderSuccess(true);
        setTimeout(() => setShowOrderSuccess(false), 3000);
    };

    const handleDownload4K = () => {
        // Simulate 4K download
        const link = document.createElement('a');
        link.href = artwork.imageUrl;
        link.download = `${artwork.title.replace(/\s+/g, '_')}_4K.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem',
                animation: 'fadeIn 0.3s ease'
            }}
            onClick={onClose}
        >
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>

            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '2rem',
                    maxWidth: '1000px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image Section */}
                <div style={{
                    flex: '1 1 45%',
                    position: 'relative',
                    minHeight: '500px',
                    background: '#F8FAFC'
                }}>
                    <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '1rem'
                        }}
                    />
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Section */}
                <div style={{
                    flex: '1 1 55%',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                }}>
                    <div style={{ marginBottom: '1rem' }}>
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

                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        color: 'var(--text-main)'
                    }}>
                        {artwork.title}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#78350F',
                            fontSize: '0.9rem'
                        }}>
                            {artwork.artist.charAt(0)}
                        </div>
                        <div>
                            <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>By {artwork.artist}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{artwork.likes} likes</p>
                        </div>
                    </div>

                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem'
                    }}>
                        "{artwork.description}"
                    </p>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {[
                            { id: 'donate', label: 'Donate', icon: Gift },
                            { id: 'print', label: 'Order Print', icon: Printer },
                            { id: 'download', label: 'Download 4K', icon: Download }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem 0.75rem',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--surface-alt)',
                                    color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Donate Tab */}
                    {activeTab === 'donate' && (
                        <div style={{
                            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                            borderRadius: '1.25rem',
                            padding: '1.25rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Gift size={18} color="#D97706" />
                                <h3 style={{ fontWeight: '700', color: '#92400E', fontSize: '0.95rem' }}>Support {artwork.artist}'s Education</h3>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#78350F', marginBottom: '0.75rem' }}>
                                Every dollar goes directly to their education savings.
                            </p>

                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                {donateOptions.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setDonateAmount(amount)}
                                        style={{
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '999px',
                                            border: donateAmount === amount ? '2px solid #D97706' : '2px solid #FCD34D',
                                            backgroundColor: donateAmount === amount ? '#FCD34D' : 'white',
                                            color: '#92400E',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleDonate}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#D97706',
                                    color: 'white',
                                    padding: '0.75rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <DollarSign size={16} />
                                Donate ${donateAmount} to Education Fund
                            </button>

                            {showDonateSuccess && (
                                <div style={{
                                    marginTop: '0.75rem',
                                    padding: '0.6rem',
                                    backgroundColor: '#D1FAE5',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    animation: 'bounceIn 0.4s ease'
                                }}>
                                    <Sparkles size={16} color="#059669" />
                                    <span style={{ color: '#065F46', fontWeight: '600', fontSize: '0.85rem' }}>
                                        Thank you! Your ${donateAmount} donation was received! 🎉
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Print Tab */}
                    {activeTab === 'print' && (
                        <div style={{
                            background: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)',
                            borderRadius: '1.25rem',
                            padding: '1.25rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Printer size={18} color="#4F46E5" />
                                <h3 style={{ fontWeight: '700', color: '#3730A3', fontSize: '0.95rem' }}>Order a Premium Print</h3>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#4338CA', marginBottom: '0.75rem' }}>
                                Get this masterpiece printed on gallery-quality paper!
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                {printOptions.map((option) => (
                                    <button
                                        key={option.size}
                                        onClick={() => handleOrderPrint(option)}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid #A5B4FC',
                                            backgroundColor: 'white',
                                            color: '#3730A3',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{option.size}</span>
                                        <span style={{ fontWeight: '600', color: '#4F46E5', fontSize: '0.85rem' }}>${option.price}</span>
                                    </button>
                                ))}
                            </div>

                            {showOrderSuccess && (
                                <div style={{
                                    padding: '0.6rem',
                                    backgroundColor: '#D1FAE5',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    animation: 'bounceIn 0.4s ease'
                                }}>
                                    <ShoppingCart size={16} color="#059669" />
                                    <span style={{ color: '#065F46', fontWeight: '600', fontSize: '0.85rem' }}>
                                        Print added to cart! 🖼️
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Download Tab */}
                    {activeTab === 'download' && (
                        <div style={{
                            background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                            borderRadius: '1.25rem',
                            padding: '1.25rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Download size={18} color="#059669" />
                                <h3 style={{ fontWeight: '700', color: '#065F46', fontSize: '0.95rem' }}>Download 4K Digital Print</h3>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '1rem' }}>
                                Get a high-resolution 4K version perfect for printing at home or at your local print shop!
                            </p>

                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '1rem',
                                padding: '1rem',
                                marginBottom: '1rem',
                                border: '2px solid #6EE7B7'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#065F46', fontWeight: '500', fontSize: '0.85rem' }}>Resolution</span>
                                    <span style={{ color: '#059669', fontWeight: '700', fontSize: '0.85rem' }}>3840 × 2160 px</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#065F46', fontWeight: '500', fontSize: '0.85rem' }}>Format</span>
                                    <span style={{ color: '#059669', fontWeight: '700', fontSize: '0.85rem' }}>PNG (High Quality)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#065F46', fontWeight: '500', fontSize: '0.85rem' }}>Price</span>
                                    <span style={{ color: '#059669', fontWeight: '700', fontSize: '0.85rem' }}>FREE ✨</span>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload4K}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    padding: '0.75rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Download size={16} />
                                Download 4K Image
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                        <button className="btn btn-outline" style={{ flex: 1, gap: '0.5rem', padding: '0.6rem' }}>
                            <Heart size={16} />
                            Like
                        </button>
                        <button className="btn btn-outline" style={{ flex: 1, gap: '0.5rem', padding: '0.6rem' }}>
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
