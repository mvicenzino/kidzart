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

    const [shipping, setShipping] = useState({
        name: '',
        address1: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setStep('customize');
    };

    const handleGoToCheckout = () => {
        setStep('checkout');
    }

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        try {
            // 1. Call our Supabase Edge Function
            // Note: In local dev, this points to localhost. In prod, it points to your Supabase project.
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-print-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    artworkUrl: artwork.imageUrl, // Ensure this is a public URL!
                    recipient: shipping,
                    productId: selectedProduct.id,
                    // In a real app, you'd pass a Stripe token here.
                    // For now, we simulate the payment token.
                    stripeToken: 'tok_visa'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            setStep('success');
        } catch (err) {
            console.error(err);
            // If we are in "Demo Mode" without a backend, we can fallback to success for UX testing
            if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
                // Fallback simulation for demo
                setTimeout(() => setStep('success'), 1500);
            } else {
                setError(err.message);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // ... (render) ...

    {
        step === 'customize' && selectedProduct && (
            // ... existing customize UI ...
            <Button variant="secondary" onClick={handleGoToCheckout} size="lg" style={{ width: '100%' }}>
                Proceed to Checkout
            </Button>
            // ...
        )
    }

    {
        step === 'checkout' && (
            <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: 'var(--space-4)' }}>
                    Shipping Details
                </h3>
                <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>

                    <input
                        required
                        placeholder="Full Name"
                        className={styles.input}
                        value={shipping.name}
                        onChange={e => setShipping({ ...shipping, name: e.target.value })}
                    />
                    <input
                        required
                        placeholder="Address Line 1"
                        className={styles.input}
                        value={shipping.address1}
                        onChange={e => setShipping({ ...shipping, address1: e.target.value })}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <input
                            required
                            placeholder="City"
                            className={styles.input}
                            value={shipping.city}
                            onChange={e => setShipping({ ...shipping, city: e.target.value })}
                        />
                        <input
                            required
                            placeholder="Zip Code"
                            className={styles.input}
                            value={shipping.zip}
                            onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <input
                            required
                            placeholder="State (e.g. CA)"
                            className={styles.input}
                            value={shipping.state}
                            onChange={e => setShipping({ ...shipping, state: e.target.value })}
                        />
                        <select
                            className={styles.input}
                            value={shipping.country}
                            onChange={e => setShipping({ ...shipping, country: e.target.value })}
                        >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                        </select>
                    </div>

                    {error && (
                        <div style={{ color: 'red', fontSize: '0.875rem', padding: 'var(--space-2)', background: '#FEF2F2', borderRadius: 'var(--radius-md)' }}>
                            {error}
                        </div>
                    )}

                    <div style={{
                        marginTop: 'var(--space-4)',
                        padding: 'var(--space-4)',
                        backgroundColor: 'var(--surface-alt)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
                            <span>Total to Pay</span>
                            <span>${selectedProduct.price}</span>
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            size="lg"
                            loading={isProcessing}
                            style={{ width: '100%' }}
                        >
                            Pay & Place Order
                        </Button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setStep('customize')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', alignSelf: 'center' }}
                    >
                        Back
                    </button>
                </form>
            </div>
        )
    }

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
                            <div style={{
                                marginLeft: 'auto',
                                padding: '4px 8px',
                                background: '#FEF3C7',
                                color: '#D97706',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                border: '1px solid #FCD34D'
                            }}>
                                DEMO MODE
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

                                        <Button variant="secondary" onClick={handleGoToCheckout} size="lg" style={{ width: '100%' }}>
                                            Proceed to Checkout
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
