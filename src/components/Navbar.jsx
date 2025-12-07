import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    SignedIn,
    SignedOut,
    UserButton,
    useClerk
} from '@clerk/clerk-react';
import { Palette, Upload, Menu, X } from 'lucide-react';
import { Button } from './ui';
import styles from './Navbar.module.css';

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
        <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
            {/* Skip Link for keyboard users */}
            <a href="#main-content" className={styles.skipLink}>
                Skip to main content
            </a>

            <div className={styles.container}>
                {/* Logo */}
                <Link to="/" className={styles.logo} aria-label="Kidzart home">
                    <div className={styles.logoIcon}>
                        <Palette size={22} aria-hidden="true" />
                    </div>
                    <span className={styles.logoText}>
                        Kidz<span className={styles.logoAccent}>art</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.desktopMenu} role="menubar">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''}`}
                            role="menuitem"
                            aria-current={isActive(link.path) ? 'page' : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <SignedOut>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignIn}
                            className={styles.desktopMenu}
                        >
                            Sign In
                        </Button>
                        <Button variant="primary" size="sm" icon={Upload}>
                            <span className={styles.desktopMenu}>Upload</span>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <Button variant="primary" size="sm" icon={Upload}>
                            <span className={styles.desktopMenu}>Upload Art</span>
                        </Button>
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
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={mobileMenuOpen ? X : Menu}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={styles.mobileMenuButton}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    />
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className={styles.mobileMenu}
                aria-hidden={!mobileMenuOpen}
                style={{ display: mobileMenuOpen ? 'block' : 'none' }}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`${styles.mobileNavLink} ${isActive(link.path) ? styles.mobileNavLinkActive : ''}`}
                        aria-current={isActive(link.path) ? 'page' : undefined}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

Navbar.propTypes = {};
