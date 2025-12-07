import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { X, TrendingUp, GraduationCap, PiggyBank, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from './ui';
import styles from './ui/Modal.module.css'; // Reusing shared modal styles

export default function DonationModal({ isOpen, onClose, artistName, childId }) {
    const [step, setStep] = useState('select'); // select, connect, success
    const [amount, setAmount] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSelectAmount = (value) => {
        setAmount(value);
        setStep('connect');
    };

    const handleConnect = (provider) => {
        setSelectedProvider(provider);
        // Simulate API call
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
            >
                <div
                    className={styles.modal}
                    style={{ maxWidth: '500px' }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--primary-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2px' }}>
                                    Invest in {artistName}'s Future
                                </h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Help fund their dreams and education
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" icon={X} onClick={onClose} aria-label="Close" />
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'var(--space-6)' }}>
                        {step === 'select' && (
                            <div className="animate-fade-in">
                                <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                                    100% of your gift goes directly into a dedicated custodial account or 529 plan for {artistName}.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                    {[
                                        { val: 5, label: 'Paintbrush Fund', icon: '🎨' },
                                        { val: 10, label: 'Art Lessons', icon: '✏️' },
                                        { val: 20, label: 'College Fund', icon: '🎓' },
                                        { val: 50, label: 'Dream Starter', icon: '🚀' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => handleSelectAmount(opt.val)}
                                            style={{
                                                padding: 'var(--space-4)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-lg)',
                                                backgroundColor: 'var(--surface)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all var(--transition-fast)'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.backgroundColor = 'var(--primary-bg)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.backgroundColor = 'var(--surface)';
                                            }}
                                        >
                                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-1)' }}>{opt.icon}</div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>${opt.val}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 'connect' && (
                            <div className="animate-fade-in">
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
                                    Select an Investment Platform
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <button
                                        onClick={() => handleConnect('Acorns Early')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--space-4)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-xl)',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{ background: '#74C043', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                <i style={{ fontStyle: 'normal', fontWeight: 'bold' }}>A</i>
                                            </div>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: '600' }}>Acorns Early</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Invest & Grow for Kids</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={20} color="var(--text-light)" />
                                    </button>

                                    <button
                                        onClick={() => handleConnect('Greenlight')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--space-4)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-xl)',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{ background: '#00352A', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                <i style={{ fontStyle: 'normal', fontWeight: 'bold' }}>G</i>
                                            </div>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: '600' }}>Greenlight</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Debit card & investing</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={20} color="var(--text-light)" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%', background: 'var(--secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                    margin: '0 auto var(--space-6)'
                                }}>
                                    <TrendingUp size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                                    Investment Sent!
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                                    You've successfully added <strong>${amount}</strong> to {artistName}'s {selectedProvider} account. Their future just got a little brighter!
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

DonationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    artistName: PropTypes.string,
    childId: PropTypes.string
};
