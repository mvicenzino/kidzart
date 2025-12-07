import React from 'react';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { LogIn, User, Settings, Bell, Palette, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import UserProfileSection from '../components/UserProfileSection';
import { useChildren } from '../hooks/useChildren';

export default function ProfilePage() {
    const { children, addChild, editChild, deleteChild, importChildren } = useChildren();

    let user = null;
    let isSignedIn = false;

    try {
        const clerkUser = useUser();
        user = clerkUser.user;
        isSignedIn = clerkUser.isSignedIn;
    } catch (e) {
        // Clerk not configured
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <Navbar />

            <main className="container" style={{
                padding: 'var(--space-8) var(--space-6)',
                maxWidth: '800px'
            }}>
                <SignedIn>
                    {/* Profile Header */}
                    <div style={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--space-8)',
                        marginBottom: 'var(--space-6)',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-5)',
                            flexWrap: 'wrap'
                        }}>
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt="Profile"
                                    style={{
                                        width: '72px',
                                        height: '72px',
                                        borderRadius: 'var(--radius-full)',
                                        objectFit: 'cover',
                                        border: '3px solid var(--surface-alt)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User size={32} color="white" />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <h1 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    fontFamily: 'var(--font-display)',
                                    marginBottom: 'var(--space-1)',
                                    color: 'var(--text-main)'
                                }}>
                                    {user?.fullName || user?.firstName || 'Welcome!'}
                                </h1>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.9375rem'
                                }}>
                                    {user?.primaryEmailAddress?.emailAddress || 'Parent Account'}
                                </p>
                            </div>
                            <div
                                className="badge badge-primary"
                                style={{
                                    padding: 'var(--space-2) var(--space-4)',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <Palette size={14} />
                                <span>{children.length} Artist{children.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Children Profiles */}
                    <UserProfileSection
                        children={children}
                        onAddChild={addChild}
                        onEditChild={editChild}
                        onDeleteChild={deleteChild}
                        onImportChildren={importChildren}
                    />

                    {/* Account Settings */}
                    <div style={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--space-6)',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            fontFamily: 'var(--font-display)',
                            marginBottom: 'var(--space-4)',
                            color: 'var(--text-main)'
                        }}>
                            Account Settings
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)'
                        }}>
                            {[
                                { icon: Settings, label: 'Edit Profile' },
                                { icon: Bell, label: 'Notification Preferences' }
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border-light)',
                                        backgroundColor: 'var(--surface)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all var(--transition-fast)',
                                        fontSize: '0.9375rem',
                                        fontWeight: '500',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    <item.icon size={18} color="var(--text-muted)" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </SignedIn>

                <SignedOut>
                    {/* Sign In Prompt */}
                    <div style={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--space-16) var(--space-8)',
                        textAlign: 'center',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--primary-bg) 0%, rgba(236, 72, 153, 0.08) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--space-6)'
                        }}>
                            <Palette size={36} color="var(--primary)" />
                        </div>
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            fontFamily: 'var(--font-display)',
                            marginBottom: 'var(--space-3)',
                            color: 'var(--text-main)'
                        }}>
                            Sign in to manage profiles
                        </h1>
                        <p style={{
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--space-8)',
                            maxWidth: '360px',
                            margin: '0 auto var(--space-8)',
                            lineHeight: 1.6
                        }}>
                            Create artist profiles for your children and start showcasing their amazing artwork!
                        </p>
                        <SignInButton mode="modal">
                            <button className="btn btn-primary btn-lg">
                                <LogIn size={18} />
                                Sign In to Continue
                            </button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </main>
        </div>
    );
}
