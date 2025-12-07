import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import { Avatar, Badge } from './ui';
import styles from './ArtCard.module.css';

export default function ArtCard({ artwork, onClick }) {
    const [isLiked, setIsLiked] = useState(false);

    const handleLikeClick = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }
    };

    return (
        <div
            className={styles.card}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`View ${artwork.title} by ${artwork.artist}`}
        >
            {/* Image Container */}
            <div className={styles.imageContainer}>
                <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className={styles.image}
                />

                {/* Like Button */}
                <button
                    onClick={handleLikeClick}
                    className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
                    aria-label={isLiked ? 'Unlike this artwork' : 'Like this artwork'}
                    aria-pressed={isLiked}
                >
                    <Heart
                        size={16}
                        color={isLiked ? 'white' : 'var(--rose)'}
                        fill={isLiked ? 'white' : 'none'}
                    />
                </button>

                {/* Age Badge */}
                <div className={styles.ageBadge}>
                    <Badge variant="default">Age {artwork.age}</Badge>
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.title}>{artwork.title}</h3>
                <p className={styles.description}>{artwork.description}</p>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.artistInfo}>
                        <Avatar
                            initials={artwork.artist.charAt(0)}
                            size="sm"
                        />
                        <span className={styles.artistName}>{artwork.artist}</span>
                    </div>

                    <div className={styles.likesCount} aria-label={`${isLiked ? artwork.likes + 1 : artwork.likes} likes`}>
                        <Heart size={14} fill="var(--rose)" color="var(--rose)" aria-hidden="true" />
                        <span>{isLiked ? artwork.likes + 1 : artwork.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

ArtCard.propTypes = {
    artwork: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
        description: PropTypes.string,
        likes: PropTypes.number
    }).isRequired,
    onClick: PropTypes.func
};
