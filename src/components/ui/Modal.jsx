import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import Button from './Button';
import styles from './Modal.module.css';

/**
 * Shared Modal wrapper with backdrop, close on escape, and body scroll lock
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
    children,
    footer,
    className = ''
}) {
    // Close on escape key
    const handleEscape = useCallback((e) => {
        if (e.key === 'Escape' && closeOnEscape) {
            onClose();
        }
    }, [onClose, closeOnEscape]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    const sizeClass = styles[`modal-${size}`];
    const modalClasses = [styles.modal, sizeClass, className].filter(Boolean).join(' ');

    return (
        <div
            className={styles.backdrop}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div className={modalClasses}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className={styles.header}>
                        {title && (
                            <h2 id="modal-title" className={styles.title}>{title}</h2>
                        )}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={X}
                                onClick={onClose}
                                aria-label="Close modal"
                                className={styles.closeButton}
                            />
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={styles.content}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    showCloseButton: PropTypes.bool,
    closeOnBackdrop: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    children: PropTypes.node,
    footer: PropTypes.node,
    className: PropTypes.string
};
