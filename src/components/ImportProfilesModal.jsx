import React, { useState } from 'react';
import { X, Upload, Link2, Check, AlertCircle, ArrowRight } from 'lucide-react';

export default function ImportProfilesModal({ isOpen, onClose, onImport }) {
    const [importMethod, setImportMethod] = useState('code'); // 'code' or 'connect'
    const [importCode, setImportCode] = useState('');
    const [kindoraEmail, setKindoraEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [importedProfiles, setImportedProfiles] = useState([]);

    const handleCodeImport = async () => {
        setError(null);
        setIsLoading(true);

        try {
            // Try to parse the import code as JSON
            let profiles;

            // Check if it's a base64 encoded string
            if (importCode.startsWith('KINDORA_')) {
                const base64Data = importCode.replace('KINDORA_', '');
                const decoded = atob(base64Data);
                profiles = JSON.parse(decoded);
            } else {
                // Try direct JSON parse
                profiles = JSON.parse(importCode);
            }

            // Validate and normalize the profiles
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
            // This would connect to kindora.ai API
            // For now, simulate the connection
            const response = await fetch(`https://api.kindora.ai/v1/profiles/export?email=${encodeURIComponent(kindoraEmail)}`, {
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
                // Fallback: Show instructions for manual export
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
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
                animation: 'fadeIn 0.2s ease'
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    width: '100%',
                    maxWidth: '520px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    animation: 'scaleIn 0.3s ease'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Upload size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                Import from Kindora
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Transfer your kid profiles from kindora.ai
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            display: 'flex'
                        }}
                    >
                        <X size={24} color="var(--text-muted)" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                    {!success ? (
                        <>
                            {/* Method Selector */}
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginBottom: '1.5rem',
                                backgroundColor: 'var(--surface)',
                                borderRadius: '0.75rem',
                                padding: '0.25rem'
                            }}>
                                <button
                                    onClick={() => setImportMethod('code')}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        backgroundColor: importMethod === 'code' ? 'white' : 'transparent',
                                        boxShadow: importMethod === 'code' ? 'var(--shadow-sm)' : 'none',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    📋 Import with Code
                                </button>
                                <button
                                    onClick={() => setImportMethod('connect')}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        backgroundColor: importMethod === 'connect' ? 'white' : 'transparent',
                                        boxShadow: importMethod === 'connect' ? 'var(--shadow-sm)' : 'none',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    🔗 Connect Account
                                </button>
                            </div>

                            {importMethod === 'code' ? (
                                <>
                                    {/* Code Import Instructions */}
                                    <div style={{
                                        backgroundColor: '#EEF2FF',
                                        borderRadius: '0.75rem',
                                        padding: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <p style={{ fontSize: '0.875rem', color: '#4338CA', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            How to get your export code:
                                        </p>
                                        <ol style={{ fontSize: '0.8rem', color: '#4338CA', margin: 0, paddingLeft: '1.25rem' }}>
                                            <li>Go to <strong>kindora.ai/settings</strong></li>
                                            <li>Click "Export Profiles"</li>
                                            <li>Copy the generated code</li>
                                            <li>Paste it below</li>
                                        </ol>
                                    </div>

                                    <textarea
                                        value={importCode}
                                        onChange={(e) => setImportCode(e.target.value)}
                                        placeholder="Paste your Kindora export code here..."
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid var(--border)',
                                            fontSize: '0.9rem',
                                            fontFamily: 'monospace',
                                            resize: 'vertical',
                                            marginBottom: '1rem'
                                        }}
                                    />

                                    <button
                                        onClick={handleCodeImport}
                                        disabled={!importCode.trim() || isLoading}
                                        className="btn btn-primary"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            justifyContent: 'center',
                                            opacity: !importCode.trim() || isLoading ? 0.5 : 1
                                        }}
                                    >
                                        {isLoading ? 'Importing...' : 'Import Profiles'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Account Connection */}
                                    <div style={{
                                        backgroundColor: '#EEF2FF',
                                        borderRadius: '0.75rem',
                                        padding: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <p style={{ fontSize: '0.875rem', color: '#4338CA' }}>
                                            Enter the email address associated with your Kindora.ai account to automatically import your profiles.
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                            fontSize: '0.875rem'
                                        }}>
                                            Kindora Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={kindoraEmail}
                                            onChange={(e) => setKindoraEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem 1rem',
                                                borderRadius: '0.75rem',
                                                border: '2px solid var(--border)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>

                                    <button
                                        onClick={handleKindoraConnect}
                                        disabled={!kindoraEmail.includes('@') || isLoading}
                                        className="btn btn-primary"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            justifyContent: 'center',
                                            opacity: !kindoraEmail.includes('@') || isLoading ? 0.5 : 1
                                        }}
                                    >
                                        <Link2 size={18} />
                                        {isLoading ? 'Connecting...' : 'Connect & Import'}
                                    </button>
                                </>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    backgroundColor: '#FEF2F2',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.75rem'
                                }}>
                                    <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                                    <p style={{ color: '#DC2626', fontSize: '0.875rem', margin: 0 }}>{error}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Success State */
                        <>
                            <div style={{
                                textAlign: 'center',
                                padding: '1rem 0 1.5rem'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: '#D1FAE5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem'
                                }}>
                                    <Check size={32} color="#059669" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                    Found {importedProfiles.length} Profile{importedProfiles.length !== 1 ? 's' : ''}!
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Ready to import from Kindora.ai
                                </p>
                            </div>

                            {/* Preview Profiles */}
                            <div style={{
                                backgroundColor: 'var(--surface)',
                                borderRadius: '1rem',
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {importedProfiles.map((profile, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            backgroundColor: 'white',
                                            borderRadius: '0.75rem',
                                            marginBottom: index < importedProfiles.length - 1 ? '0.5rem' : 0
                                        }}
                                    >
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem'
                                        }}>
                                            {profile.avatarEmoji}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '600', marginBottom: '0.1rem' }}>{profile.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age {profile.age}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={handleClose}
                                    className="btn btn-outline"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmImport}
                                    className="btn btn-primary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    <ArrowRight size={18} />
                                    Import All
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Link */}
                {!success && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderTop: '1px solid var(--border)',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Don't have a Kindora account?{' '}
                            <a
                                href="https://kindora.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--primary)', fontWeight: '600' }}
                            >
                                Sign up at kindora.ai
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
