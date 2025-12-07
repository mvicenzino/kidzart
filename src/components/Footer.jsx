import React from 'react';
import { Heart, Globe } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = 2026;

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.topSection}>
                    {/* Brand Column */}
                    <div className={styles.column}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Heart size={16} fill="currentColor" />
                            </div>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.25rem' }}>KidzArt</span>
                        </div>
                        <p className={styles.description}>
                            Preserving the creativity of childhood, one masterpiece at a time.
                            Part of the Kindora Family.
                        </p>
                    </div>

                    {/* Company Column */}
                    <div className={styles.column}>
                        <h4 className={styles.heading}>Company</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#" className={styles.link}>About Us</a></li>
                            <li><a href="#" className={styles.link}>Careers</a></li>
                            <li><a href="#" className={styles.link}>Contact</a></li>
                            <li><a href="#" className={styles.link}>Press</a></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className={styles.column}>
                        <h4 className={styles.heading}>Legal</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#" className={styles.link}>Privacy Policy</a></li>
                            <li><a href="#" className={styles.link}>Terms of Service</a></li>
                            <li><a href="#" className={styles.link}>Cookie Policy</a></li>
                            <li><a href="#" className={styles.link}>Security</a></li>
                        </ul>
                    </div>

                    {/* Kindora Family Column */}
                    <div className={styles.column}>
                        <h4 className={styles.heading}>Kindora Family</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <a href="https://kindora.ai" target="_blank" rel="noopener noreferrer" className={styles.link}>
                                    <Globe size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                    Kindora.ai
                                </a>
                            </li>
                            <li>
                                <a href="https://kiddochore.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                                    <Globe size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                    KiddoChore
                                </a>
                            </li>
                            <li><a href="#" className={styles.link}>Family Dashboard</a></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <p className={styles.copyright}>
                        &copy; {currentYear} Kindora Family, Inc. All rights reserved.
                    </p>
                    <div className={styles.socials}>
                        {/* Social Icons would go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
