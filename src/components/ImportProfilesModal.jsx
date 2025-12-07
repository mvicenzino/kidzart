import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { X, Upload, Link2, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Avatar } from './ui';
import styles from './ImportProfilesModal.module.css';

export default function ImportProfilesModal({ isOpen, onClose, onImport }) {
    const [importMethod, setImportMethod] = useState('code');
    const [importCode, setImportCode] = useState('');
    const [kindoraEmail, setKindoraEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [importedProfiles, setImportedProfiles] = useState([]);
    const previousActiveElement = useRef(null);

    // Save focus and lock body scroll
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
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
            if (e.key === 'Escape') handleClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleCodeImport = async () => {
        setError(null);
        setIsLoading(true);

        try {
            let profiles;

            if (importCode.startsWith('KINDORA_')) {
                const base64Data = importCode.replace('KINDORA_', '');
                const decoded = atob(base64Data);
                profiles = JSON.parse(decoded);
            } else {
                profiles = JSON.parse(importCode);
            }

            if (!Array.isArray(profiles)) {
                profiles = [profiles];
            }

            const normalizedProfiles = profiles.map((p, index) => ({
                id: Date.now() + index,
                name: p.name || p.childName || 'Unnamed',
                age: parseInt(p.age || p.childAge) || 5,
                description: p.description || p.bio || '',
                avatarEmoji: p.avatarEmoji || p.avatar || '🎨',
                importedFrom: 'kindora.ai',
                importedAt: new Date().toISOString()
            }));

            setImportedProfiles(normalizedProfiles);
            setSuccess(true);
        } catch (e) {
            setError('Invalid import code. Please check and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKindoraConnect = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_KINDORA_API_URL || 'https://api.kindora.ai/v1';
            const response = await fetch(`${apiUrl}/profiles/export?email=${encodeURIComponent(kindoraEmail)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).catch(() => null);

            if (response && response.ok) {
                const data = await response.json();
                setImportedProfiles(data.profiles || []);
                setSuccess(true);
            } else {
                setError(
                    'Unable to connect automatically. Please go to kindora.ai/settings/export to get your export code, then use "Import with Code" option.'
                );
            }
        } catch (e) {
            setError('Connection failed. Please use the "Import with Code" option instead.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmImport = () => {
        onImport(importedProfiles);
        handleClose();
    };

    const handleClose = () => {
        setImportCode('');
        setKindoraEmail('');
        setError(null);
        setSuccess(false);
        setImportedProfiles([]);
        setImportMethod('code');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <FocusTrap active={isOpen}>
            <div
                className={styles.backdrop}
                onClick={handleClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="import-modal-title"
            >
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.headerIcon}>
                                <Upload size={24} color="white" aria-hidden="true" />
                            </div>
                            <div>
                                <h2 id="import-modal-title" className={styles.title}>
                                    Import from Kindora
                                </h2>
                                <p className={styles.subtitle}>
                                    Transfer your kid profiles from kindora.ai
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={X}
                            onClick={handleClose}
                            aria-label="Close modal"
                        />
                    </div>

                    {/* Content */}
                    <div className={styles.content}>
                        {!success ? (
                            <>
                                {/* Method Selector - Tab list */}
                                <div
                                    className={styles.tabList}
                                    role="tablist"
                                    aria-label="Import method"
                                >
                                    <button
                                        role="tab"
                                        aria-selected={importMethod === 'code'}
                                        aria-controls="code-panel"
                                        id="code-tab"
                                        onClick={() => setImportMethod('code')}
                                        className={`${styles.tab} ${importMethod === 'code' ? styles.tabActive : ''}`}
                                    >
                                        📋 Import with Code
                                    </button>
                                    <button
                                        role="tab"
                                        aria-selected={importMethod === 'connect'}
                                        aria-controls="connect-panel"
                                        id="connect-tab"
                                        onClick={() => setImportMethod('connect')}
                                        className={`${styles.tab} ${importMethod === 'connect' ? styles.tabActive : ''}`}
                                    >
                                        🔗 Connect Account
                                    </button>
                                </div>

                                {importMethod === 'code' ? (
                                    <div
                                        role="tabpanel"
                                        id="code-panel"
                                        aria-labelledby="code-tab"
                                    >
                                        {/* Code Import Instructions */}
                                        <div className={styles.infoBox}>
                                            <p className={styles.infoTitle}>
                                                How to get your export code:
                                            </p>
                                            <ol className={styles.infoList}>
                                                <li>Go to <strong>kindora.ai/settings</strong></li>
                                                <li>Click "Export Profiles"</li>
                                                <li>Copy the generated code</li>
                                                <li>Paste it below</li>
                                            </ol>
                                        </div>

                                        <label htmlFor="import-code" className="sr-only">
                                            Kindora export code
                                        </label>
                                        <textarea
                                            id="import-code"
                                            value={importCode}
                                            onChange={(e) => setImportCode(e.target.value)}
                                            placeholder="Paste your Kindora export code here..."
                                            rows={4}
                                            className={styles.textarea}
                                            aria-describedby="code-instructions"
                                        />

                                        <Button
                                            onClick={handleCodeImport}
                                            disabled={!importCode.trim() || isLoading}
                                            variant="primary"
                                            fullWidth
                                            loading={isLoading}
                                        >
                                            Import Profiles
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        role="tabpanel"
                                        id="connect-panel"
                                        aria-labelledby="connect-tab"
                                    >
                                        {/* Account Connection */}
                                        <div className={styles.infoBox}>
                                            <p className={styles.infoText}>
                                                Enter the email address associated with your Kindora.ai account to automatically import your profiles.
                                            </p>
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="kindora-email" className={styles.label}>
                                                Kindora Email Address
                                            </label>
                                            <input
                                                id="kindora-email"
                                                type="email"
                                                value={kindoraEmail}
                                                onChange={(e) => setKindoraEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                className={styles.input}
                                            />
                                        </div>

                                        <Button
                                            onClick={handleKindoraConnect}
                                            disabled={!kindoraEmail.includes('@') || isLoading}
                                            variant="primary"
                                            fullWidth
                                            icon={Link2}
                                            loading={isLoading}
                                        >
                                            Connect & Import
                                        </Button>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className={styles.errorBox} role="alert">
                                        <AlertCircle size={20} aria-hidden="true" />
                                        <p>{error}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Success State */
                            <>
                                <div className={styles.successHeader}>
                                    <div className={styles.successIcon}>
                                        <Check size={32} color="#059669" aria-hidden="true" />
                                    </div>
                                    <h3 className={styles.successTitle}>
                                        Found {importedProfiles.length} Profile{importedProfiles.length !== 1 ? 's' : ''}!
                                    </h3>
                                    <p className={styles.successSubtitle}>
                                        Ready to import from Kindora.ai
                                    </p>
                                </div>

                                {/* Preview Profiles */}
                                <div className={styles.profilesPreview}>
                                    {importedProfiles.map((profile, index) => (
                                        <div key={index} className={styles.profileCard}>
                                            <Avatar emoji={profile.avatarEmoji} size="md" />
                                            <div>
                                                <p className={styles.profileName}>{profile.name}</p>
                                                <p className={styles.profileAge}>Age {profile.age}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.actions}>
                                    <Button variant="outline" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" icon={ArrowRight} onClick={handleConfirmImport}>
                                        Import All
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Link */}
                    {!success && (
                        <div className={styles.footer}>
                            <p>
                                Don't have a Kindora account?{' '}
                                <a
                                    href="https://kindora.ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Sign up at kindora.ai
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </FocusTrap>
    );
}

ImportProfilesModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired
};
