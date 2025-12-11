import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { X, ShoppingBag, Check } from 'lucide-react';
import { Button } from './ui';
import styles from './ui/Modal.module.css';

export default function PrintShopModal({ isOpen, onClose, artwork }) {
    const [step, setStep] = useState('select');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Environment Validation - purely text based, no client init here
    const [configStatus, setConfigStatus] = useState({
        hasUrl: false,
        hasKey: false,
        checked: false
    });

    // MOVED UP: State initialization must happen before any returns
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

    const products = [
        { id: 'canvas', name: 'Gallery Canvas', price: 49.99, icon: '🖼️', desc: 'Museum quality wrap (16x20)' },
        { id: 'mug', name: 'Morning Mug', price: 14.99, icon: '☕', desc: '11oz ceramic mug' },
        { id: 'shirt', name: 'Artist Tee', price: 24.99, icon: '👕', desc: 'Soft cotton youth tee' },
        { id: 'book', name: 'Hardcover Book', price: 39.99, icon: '📚', desc: '20-page memory book' }
    ];

    useEffect(() => {
        try {
            const url = import.meta.env.VITE_SUPABASE_URL;
            const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
            setConfigStatus({
                hasUrl: !!url,
                hasKey: !!key,
                checked: true
            });
        } catch (e) {
            console.error("Env check failed:", e);
        }
    }, []);

    const isConfigured = configStatus.hasUrl && configStatus.hasKey;

    // Debug logging
    useEffect(() => {
        if (isOpen) {
            console.log('Print Shop Modal Opened');
            console.log('Config:', configStatus);
            if (artwork) console.log('Artwork loaded:', artwork.title);
            else console.error('Artwork missing!');
        }
    }, [isOpen, configStatus, artwork]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; }
    }, [isOpen]);

    if (!isOpen || !artwork) return null;

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

        if (!isConfigured) {
            setError("Configuration Error: Missing API Keys. Please check Vercel settings.");
            setIsProcessing(false);
            return;
        }

        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            const response = await fetch(`${supabaseUrl}/functions/v1/create-print-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`
                },
                body: JSON.stringify({
                    artworkUrl: artwork.imageUrl,
                    recipient: shipping,
                    productId: selectedProduct.id,
                    stripeToken: 'tok_visa'
                })
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                if (response.status === 404) {
                    throw new Error("Backend function not found. Did you deploy 'create-print-order'?");
                }
                throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}...`);
            }

            if (!response.ok) {
                throw new Error(data.error || `Order Failed (${response.status})`);
            }

            setStep('success');
        } catch (err) {
            console.error("Print Shop Error:", err);
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Use inline styles for the critical outer layers to prevent CSS module issues from hiding the modal
    const backdropStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
    };

    const modalStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '1.5rem',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10001
    };

    return createPortal(
        <div
            style={backdropStyle}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                style={modalStyle}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '9999px',
                            background: '#ec4899', // Pink-500
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2px', lineHeight: 1.2 }}>
                                KidzArt Print Shop
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                Turn "{artwork.title}" into a keepsake
                            </p>
                        </div>
                    </div>

                    {isConfigured ? (
                        <div style={{
                            marginLeft: 'auto',
                            marginRight: '1rem',
                            padding: '4px 8px',
                            background: '#E0F2FE',
                            color: '#0369A1',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            border: '1px solid #BAE6FD',
                            whiteSpace: 'nowrap'
                        }}>
                            BETA
                        </div>
                    ) : (
                        <div style={{
                            marginLeft: 'auto',
                            marginRight: '1rem',
                            padding: '4px 8px',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            border: '1px solid #FECACA',
                            whiteSpace: 'nowrap'
                        }}>
                            SETUP NEEDED
                        </div>
                    )}

                    <Button variant="ghost" icon={X} onClick={onClose} aria-label="Close" />
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', overflowY: 'auto' }}>

                    {!isConfigured && step !== 'success' && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            color: '#7F1D1D',
                            fontSize: '0.875rem'
                        }}>
                            <strong>Backend Configuration Missing:</strong> <br />
                            This feature requires keys in your Vercel Environment Variables:
                            <ul style={{ margin: '0.5rem 0 0 1rem', paddingLeft: '1rem' }}>
                                <li><code>VITE_SUPABASE_URL</code></li>
                                <li><code>VITE_SUPABASE_ANON_KEY</code></li>
                            </ul>
                        </div>
                    )}

                    {step === 'select' && (
                        <div className="animate-fade-in">
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem'
                            }}>
                                {products.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleProductSelect(p)}
                                        style={{
                                            padding: '1rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '1rem',
                                            backgroundColor: '#ffffff',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'transform 0.2s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            width: '100%'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = '#ec4899';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{p.icon}</div>
                                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>{p.desc}</div>
                                        <div style={{ fontWeight: '600', color: '#ec4899' }}>${p.price}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'customize' && selectedProduct && (
                        <div className="animate-fade-in">
                            <div style={{
                                display: 'flex',
                                gap: '1.5rem',
                                marginBottom: '1.5rem',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                {/* Mockup Preview */}
                                <div style={{
                                    flex: '1 1 200px',
                                    aspectRatio: '1',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ fontSize: '8rem', opacity: 0.1 }}>{selectedProduct.icon}</div>
                                    <img
                                        src={artwork.imageUrl}
                                        alt="Preview"
                                        style={{
                                            position: 'absolute',
                                            width: '50%',
                                            height: 'auto',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            transform: 'rotate(-5deg)',
                                            border: '2px solid white'
                                        }}
                                    />
                                </div>

                                <div style={{ flex: '1 1 200px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{selectedProduct.name}</h3>
                                    <p style={{ color: '#64748b', marginBottom: '1rem' }}>{selectedProduct.desc}</p>

                                    <div style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '0.5rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                                            marginTop: '0.75rem',
                                            width: '100%',
                                            background: 'none',
                                            border: 'none',
                                            color: '#64748b',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Back to products
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'checkout' && (
                        <div className="animate-fade-in">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
                                Shipping Details
                            </h3>
                            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                                <input
                                    required
                                    placeholder="Full Name"
                                    className={styles.input}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
                                    value={shipping.name}
                                    onChange={e => setShipping({ ...shipping, name: e.target.value })}
                                />
                                <input
                                    required
                                    placeholder="Address Line 1"
                                    className={styles.input}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
                                    value={shipping.address1}
                                    onChange={e => setShipping({ ...shipping, address1: e.target.value })}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <input
                                        required
                                        placeholder="City"
                                        className={styles.input}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
                                        value={shipping.city}
                                        onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                    />
                                    <input
                                        required
                                        placeholder="Zip Code"
                                        className={styles.input}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
                                        value={shipping.zip}
                                        onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <input
                                        required
                                        placeholder="State (e.g. CA)"
                                        className={styles.input}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
                                        value={shipping.state}
                                        onChange={e => setShipping({ ...shipping, state: e.target.value })}
                                    />
                                    <select
                                        className={styles.input}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
                                        value={shipping.country}
                                        onChange={e => setShipping({ ...shipping, country: e.target.value })}
                                    >
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                    </select>
                                </div>

                                {error && (
                                    <div style={{ color: '#B91C1C', fontSize: '0.875rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '0.375rem', border: '1px solid #FCA5A5' }}>
                                        <strong>Error:</strong> {error}
                                    </div>
                                )}

                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '0.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '1rem' }}>
                                        <span>Total to Pay</span>
                                        <span>${selectedProduct.price}</span>
                                    </div>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        loading={isProcessing}
                                        style={{ width: '100%' }}
                                        disabled={!isConfigured}
                                    >
                                        {isConfigured ? 'Pay & Place Order' : 'Setup Required'}
                                    </Button>
                                    {!isConfigured && <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', textAlign: 'center' }}>Configure env vars to enable payment</p>}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep('customize')}
                                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', alignSelf: 'center', marginTop: '0.5rem' }}
                                >
                                    Back
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem 0' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%', background: '#22c55e',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Check size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Order Placed Successfully!
                            </h3>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                                Your {selectedProduct.name} is being processed. In a real application, you would receive a confirmation email shortly.
                            </p>
                            <Button variant="primary" onClick={onClose}>Done</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
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
