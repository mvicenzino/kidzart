import React from 'react';
import PropTypes from 'prop-types';
import styles from './Avatar.module.css';

/**
 * Reusable Avatar component with emoji, initials, or image support
 */
export default function Avatar({
    emoji,
    initials,
    src,
    alt = '',
    size = 'md',
    gradient = true,
    className = '',
    ...props
}) {
    const classNames = [
        styles.avatar,
        styles[`avatar-${size}`],
        gradient && !src && styles.gradient,
        className
    ].filter(Boolean).join(' ');

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={classNames}
                {...props}
            />
        );
    }

    return (
        <div className={classNames} {...props}>
            {emoji || initials || '🎨'}
        </div>
    );
}

Avatar.propTypes = {
    emoji: PropTypes.string,
    initials: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    gradient: PropTypes.bool,
    className: PropTypes.string
};
