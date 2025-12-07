import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Reusable Button component with variants, sizes, and icon support
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    className = '',
    onClick,
    ...props
}) {
    const classNames = [
        styles.btn,
        styles[`btn-${variant}`],
        styles[`btn-${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        loading && styles.loading,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <span className={styles.spinner} aria-hidden="true" />
            )}
            {Icon && iconPosition === 'left' && !loading && (
                <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
            )}
            {children && <span>{children}</span>}
            {Icon && iconPosition === 'right' && !loading && (
                <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
            )}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    icon: PropTypes.elementType,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    onClick: PropTypes.func
};
