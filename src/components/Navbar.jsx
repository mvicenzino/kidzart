import React from 'react';
import { Link } from 'react-router-dom';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useClerk
} from '@clerk/clerk-react';
import { Palette, Upload, Heart, LogIn, User } from 'lucide-react';

export default function Navbar() {
    const { openSignIn } = useClerk();

    const handleSignIn = () => {
        openSignIn();
    };

    return (
        <nav style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '80px'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{
                        backgroundColor: 'var(--primary)',
                        padding: '0.5rem',
                        borderRadius: '12px',
                        color: 'white',
                        display: 'flex'
                    }}>
                        <Palette size={24} />
                    </div>
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        letterSpacing: '-0.02em',
                        color: 'var(--text-main)'
                    }}>
                        Kidz<span style={{ color: 'var(--primary)' }}>art</span>
                    </span>
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-menu">
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Explore</Link>
                    <a href="/#gallery" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Gallery</a>
                    <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Artists</Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                        <Heart size={20} />
                    </button>

                    {/* Show when user is signed out */}
                    <SignedOut>
                        <button
                            onClick={handleSignIn}
                            className="btn btn-outline"
                            style={{ gap: '0.5rem' }}
                        >
                            <LogIn size={18} />
                            Sign In
                        </button>
                        <button className="btn btn-primary">
                            <Upload size={18} />
                            <span>Upload Art</span>
                        </button>
                    </SignedOut>

                    {/* Show when user is signed in */}
                    <SignedIn>
                        <Link to="/profile" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                            <User size={20} />
                        </Link>
                        <button className="btn btn-primary">
                            <Upload size={18} />
                            <span>Upload Art</span>
                        </button>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: {
                                        width: 40,
                                        height: 40
                                    }
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
