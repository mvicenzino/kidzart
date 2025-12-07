import React from 'react';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { LogIn, User, Settings, Bell } from 'lucide-react';
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
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)' }}>
            <Navbar />

            <main className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
                <SignedIn>
                    {/* Profile Header */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        marginBottom: '2rem',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt="Profile"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User size={40} color="white" />
                                </div>
                            )}
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                                    {user?.fullName || user?.firstName || 'Welcome!'}
                                </h1>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    {user?.primaryEmailAddress?.emailAddress || 'Parent Account'}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                                    <span style={{
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}>
                                        {children.length} Artist{children.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
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
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
                            ⚙️ Account Settings
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s'
                            }}>
                                <Settings size={20} color="var(--text-muted)" />
                                <span>Edit Profile</span>
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s'
                            }}>
                                <Bell size={20} color="var(--text-muted)" />
                                <span>Notification Preferences</span>
                            </button>
                        </div>
                    </div>
                </SignedIn>

                <SignedOut>
                    {/* Sign In Prompt */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                            Sign in to manage profiles
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Create artist profiles for your children and start showcasing their amazing artwork!
                        </p>
                        <SignInButton mode="modal">
                            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                <LogIn size={20} />
                                Sign In to Continue
                            </button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </main>
        </div>
    );
}
