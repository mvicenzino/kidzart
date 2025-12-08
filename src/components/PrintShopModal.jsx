import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { X, ShoppingBag, Truck, Check } from 'lucide-react';
import { Button } from './ui';
import styles from './ui/Modal.module.css';

export default function PrintShopModal({ isOpen, onClose, artwork }) {
    const [step, setStep] = useState('select'); // select, customize, success
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (!isOpen || !artwork) return null;

    const products = [
        { id: 'canvas', name: 'Gallery Canvas', price: 49.99, icon: '🖼️', desc: 'Museum quality wrap (16x20)' },
        { id: 'mug', name: 'Morning Mug', price: 14.99, icon: '☕', desc: '11oz ceramic mug' },
        { id: 'shirt', name: 'Artist Tee', price: 24.99, icon: '👕', desc: 'Soft cotton youth tee' },
        { id: 'book', name: 'Hardcover Book', price: 39.99, icon: '📚', desc: '20-page memory book' }
    ];

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setStep('customize');
    };

    const handleOrder = () => {
        // Simulate API call to Print Provider
        setTimeout(() => {
            setStep('success');
        }, 1500);
    };

    return (
        <FocusTrap active={isOpen}>
            <div
                className={styles.backdrop}
                onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 1100 }}
            >
                <div
                    className={styles.modal}
                    style={{ maxWidth: '600px', height: 'auto', maxHeight: '90vh' }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2px' }}>
                                    KidzArt Print Shop
                                </h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Turn "{artwork.title}" into a keepsake
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" icon={X} onClick={onClose} aria-label="Close" />
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'var(--space-6)', overflowY: 'auto' }}>
                        {step === 'select' && (
                            <div className="animate-fade-in">
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: 'var(--space-4)'
                                }}>
                                    {products.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleProductSelect(p)}
                                            style={{
                                                padding: 'var(--space-4)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-xl)',
                                                backgroundColor: 'var(--surface)',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all var(--transition-fast)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--secondary)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.transform = 'none';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>{p.icon}</div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>{p.desc}</div>
                                            <div style={{ fontWeight: '600', color: 'var(--secondary)' }}>${p.price}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 'customize' && selectedProduct && (
                            <div className="animate-fade-in">
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-6)',
                                    marginBottom: 'var(--space-6)',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    {/* Mockup Preview */}
                                    <div style={{
                                        flex: '1 1 200px',
                                        aspectRatio: '1',
                                        backgroundColor: '#f1f5f9',
                                        borderRadius: 'var(--radius-xl)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div style={{ fontSize: '8rem', opacity: 0.1 }}>{selectedProduct.icon}</div>
                                        <img
                                            src={artwork.imageUrl}
                                            alt="Preview"
                                            style={{
                                                position: 'absolute',
                                                width: '50%',
                                                height: 'auto',
                                                boxShadow: 'var(--shadow-lg)',
                                                transform: 'rotate(-5deg)',
                                                border: '2px solid white'
                                            }}
                                        />
                                    </div>

                                    <div style={{ flex: '1 1 200px' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>{selectedProduct.name}</h3>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{selectedProduct.desc}</p>

                                        <div style={{
                                            padding: 'var(--space-3)',
                                            backgroundColor: 'var(--surface-alt)',
                                            borderRadius: 'var(--radius-lg)',
                                            marginBottom: 'var(--space-6)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                                <span>Subtotal</span>
                                                <span>${selectedProduct.price}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                                                <span>Total</span>
                                                <span>${selectedProduct.price}</span>
                                            </div>
                                        </div>

                                        <Button variant="secondary" onClick={handleOrder} size="lg" style={{ width: '100%' }}>
                                            Add to Cart
                                        </Button>
                                        <button
                                            onClick={() => setStep('select')}
                                            style={{
                                                marginTop: 'var(--space-3)',
                                                width: '100%',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Back to products
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%', background: '#22c55e',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                    margin: '0 auto var(--space-6)'
                                }}>
                                    <Check size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                                    Added to Cart!
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                                    We've simulated adding this {selectedProduct.name} to your cart. In production, this would connect to a service like Printful or Gelato.
                                </p>
                                <Button variant="primary" onClick={onClose}>Done</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}

PrintShopModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    artwork: PropTypes.shape({
        title: PropTypes.string,
        imageUrl: PropTypes.string
    })
};
