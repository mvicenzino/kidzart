import React from 'react';
import PropTypes from 'prop-types';
import styles from './Badge.module.css';

/**
 * Reusable Badge component for status indicators, age badges, etc.
 */
export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    icon: Icon,
    className = '',
    ...props
}) {
    const classNames = [
        styles.badge,
        styles[`badge-${variant}`],
        styles[`badge-${size}`],
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classNames} {...props}>
            {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
            {children}
        </span>
    );
}

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger']),
    size: PropTypes.oneOf(['sm', 'md']),
    icon: PropTypes.elementType,
    className: PropTypes.string
};
