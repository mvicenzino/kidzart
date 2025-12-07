import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { X, User, Calendar, FileText, Plus } from 'lucide-react';
import { Button } from './ui';
import styles from './ChildProfileModal.module.css';

export default function ChildProfileModal({ isOpen, onClose, onSave, existingChild = null }) {
    const [formData, setFormData] = useState({
        name: existingChild?.name || '',
        age: existingChild?.age || '',
        description: existingChild?.description || '',
        avatarEmoji: existingChild?.avatarEmoji || '🎨'
    });
    const [errors, setErrors] = useState({});
    const previousActiveElement = useRef(null);

    const emojiOptions = ['🎨', '🦄', '🚀', '🌟', '🎪', '🦋', '🐱', '🐶', '🌈', '🎸', '⚽', '🎮'];

    // Save focus and lock body scroll when modal opens
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, isOpen]);

    // Reset form when existingChild changes
    useEffect(() => {
        if (existingChild) {
            setFormData({
                name: existingChild.name || '',
                age: existingChild.age || '',
                description: existingChild.description || '',
                avatarEmoji: existingChild.avatarEmoji || '🎨'
            });
        } else {
            setFormData({ name: '', age: '', description: '', avatarEmoji: '🎨' });
        }
    }, [existingChild]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.age) newErrors.age = 'Age is required';
        if (formData.age && (formData.age < 1 || formData.age > 18)) {
            newErrors.age = 'Age must be between 1 and 18';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            ...formData,
            age: parseInt(formData.age),
            id: existingChild?.id || Date.now()
        });

        setFormData({ name: '', age: '', description: '', avatarEmoji: '🎨' });
        onClose();
    };

    const handleClose = () => {
        setFormData({ name: '', age: '', description: '', avatarEmoji: '🎨' });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <FocusTrap active={isOpen}>
            <div
                className={styles.backdrop}
                onClick={handleClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="child-profile-modal-title"
            >
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.headerAvatar}>
                                {formData.avatarEmoji}
                            </div>
                            <div>
                                <h2 id="child-profile-modal-title" className={styles.title}>
                                    {existingChild ? 'Edit Artist Profile' : 'Add Young Artist'}
                                </h2>
                                <p className={styles.subtitle}>
                                    Create a profile for your child
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={X}
                            onClick={handleClose}
                            aria-label="Close modal"
                        />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Avatar Emoji Selector */}
                        <div className={styles.field}>
                            <label id="avatar-label" className={styles.label}>
                                Choose an Avatar
                            </label>
                            <div
                                className={styles.emojiGrid}
                                role="radiogroup"
                                aria-labelledby="avatar-label"
                            >
                                {emojiOptions.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, avatarEmoji: emoji }))}
                                        className={`${styles.emojiButton} ${formData.avatarEmoji === emoji ? styles.selected : ''}`}
                                        role="radio"
                                        aria-checked={formData.avatarEmoji === emoji}
                                        aria-label={`Select ${emoji} avatar`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name Field */}
                        <div className={styles.field}>
                            <label htmlFor="child-name" className={styles.label}>
                                <User size={16} aria-hidden="true" />
                                Child's Name *
                            </label>
                            <input
                                id="child-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Sebastian"
                                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                            />
                            {errors.name && (
                                <p id="name-error" className={styles.errorText} role="alert">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Age Field */}
                        <div className={styles.field}>
                            <label htmlFor="child-age" className={styles.label}>
                                <Calendar size={16} aria-hidden="true" />
                                Age *
                            </label>
                            <input
                                id="child-age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="e.g., 4"
                                min="1"
                                max="18"
                                className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
                                aria-invalid={!!errors.age}
                                aria-describedby={errors.age ? 'age-error' : undefined}
                            />
                            {errors.age && (
                                <p id="age-error" className={styles.errorText} role="alert">
                                    {errors.age}
                                </p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className={styles.field}>
                            <label htmlFor="child-description" className={styles.label}>
                                <FileText size={16} aria-hidden="true" />
                                About (Optional)
                            </label>
                            <textarea
                                id="child-description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about your little artist..."
                                rows={3}
                                className={styles.textarea}
                                aria-describedby="description-hint"
                            />
                            <p id="description-hint" className={styles.hintText}>
                                e.g., "Loves dinosaurs and painting with bright colors"
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            icon={Plus}
                        >
                            {existingChild ? 'Save Changes' : 'Add Artist Profile'}
                        </Button>
                    </form>
                </div>
            </div>
        </FocusTrap>
    );
}

ChildProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    existingChild: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
        avatarEmoji: PropTypes.string
    })
};
