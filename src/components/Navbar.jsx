import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useClerk
} from '@clerk/clerk-react';
import { Palette, Upload, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { openSignIn } = useClerk();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignIn = () => {
        openSignIn();
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Gallery' },
        { path: '/profile', label: 'My Artists' }
    ];

    return (
        <nav style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-light)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '72px'
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    textDecoration: 'none'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                        padding: '0.5rem',
                        borderRadius: '10px',
                        color: 'white',
                        display: 'flex',
                        boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)'
                    }}>
                        <Palette size={22} />
                    </div>
                    <span style={{
                        fontSize: '1.375rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.02em',
                        color: 'var(--text-main)'
                    }}>
                        Kidz<span style={{ color: 'var(--primary)' }}>art</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                }} className="desktop-menu">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive(link.path) ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: 500,
                                fontSize: '0.9375rem',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isActive(link.path) ? 'var(--primary-bg)' : 'transparent',
                                transition: 'all var(--transition-fast)'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <SignedOut>
                        <button
                            onClick={handleSignIn}
                            className="btn btn-ghost btn-sm desktop-menu"
                        >
                            Sign In
                        </button>
                        <button className="btn btn-primary btn-sm">
                            <Upload size={16} />
                            <span className="desktop-menu">Upload</span>
                        </button>
                    </SignedOut>

                    <SignedIn>
                        <button className="btn btn-primary btn-sm">
                            <Upload size={16} />
                            <span className="desktop-menu">Upload Art</span>
                        </button>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: {
                                        width: 36,
                                        height: 36
                                    }
                                }
                            }}
                        />
                    </SignedIn>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="btn btn-ghost btn-icon"
                        style={{ display: 'none' }}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div style={{
                    padding: '1rem',
                    borderTop: '1px solid var(--border-light)',
                    backgroundColor: 'white'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                color: isActive(link.path) ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: 500,
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isActive(link.path) ? 'var(--primary-bg)' : 'transparent',
                                textDecoration: 'none',
                                marginBottom: '0.25rem'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
