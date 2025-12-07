import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { X, Upload, ImagePlus, Plus, Palette } from 'lucide-react';
import { Button, Avatar } from './ui';
import { taxonomy } from '../data/mockData';
import styles from './UploadArtModal.module.css';

export default function UploadArtModal({ isOpen, onClose, onUpload, childProfiles = [] }) {
    const [isDragging, setIsDragging] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        childId: null,
        medium: '',
        theme: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Focus management and body scroll lock
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

    // Close on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, []);

    const handleFileSelect = (file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, image: 'Please upload a valid image (JPEG, PNG, GIF, or WebP)' }));
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: 'Image must be less than 10MB' }));
            return;
        }

        setErrors(prev => ({ ...prev, image: null }));
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleChildSelect = (childId) => {
        setFormData(prev => ({ ...prev, childId }));
        if (errors.childId) {
            setErrors(prev => ({ ...prev, childId: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!imageFile) {
            newErrors.image = 'Please upload an image';
        }
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.childId && childProfiles.length > 0) {
            newErrors.childId = 'Please select an artist';
        }
        if (!formData.medium) {
            newErrors.medium = 'Please select a medium';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Find the selected child
            const selectedChild = childProfiles.find(c => c.id === formData.childId);

            // Create artwork data
            const artworkData = {
                id: Date.now(),
                title: formData.title,
                description: formData.description,
                artist: selectedChild?.name || 'Anonymous Artist',
                age: selectedChild?.age || 5,
                medium: formData.medium,
                theme: formData.theme || 'imaginative-play',
                imageUrl: imagePreview, // In production, this would be uploaded to storage
                imageFile: imageFile,
                likes: 0,
                createdAt: new Date().toISOString()
            };

            if (onUpload) {
                await onUpload(artworkData);
            }

            handleClose();
        } catch (error) {
            console.error('Upload failed:', error);
            setErrors(prev => ({ ...prev, submit: 'Failed to upload artwork. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({
            title: '',
            description: '',
            childId: null,
            medium: '',
            theme: ''
        });
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
    };

    if (!isOpen) return null;

    return (
        <FocusTrap active={isOpen}>
            <div
                className={styles.backdrop}
                onClick={handleClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-modal-title"
            >
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.headerIcon}>
                                <Upload size={22} aria-hidden="true" />
                            </div>
                            <div>
                                <h2 id="upload-modal-title" className={styles.title}>
                                    Upload Artwork
                                </h2>
                                <p className={styles.subtitle}>
                                    Share your child's creation with the world
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

                    {/* Content */}
                    <div className={styles.content}>
                        {/* Dropzone */}
                        <div
                            className={`${styles.dropzone} ${isDragging ? styles.active : ''} ${imagePreview ? styles.hasImage : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !imagePreview && fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && !imagePreview) {
                                    e.preventDefault();
                                    fileInputRef.current?.click();
                                }
                            }}
                            aria-label={imagePreview ? 'Image uploaded' : 'Drop image or click to upload'}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                                className={styles.fileInput}
                                aria-label="Select image file"
                            />

                            {imagePreview ? (
                                <div className={styles.preview}>
                                    <img
                                        src={imagePreview}
                                        alt="Artwork preview"
                                        className={styles.previewImage}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className={styles.removeButton}
                                        aria-label="Remove image"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.dropzoneIcon}>
                                        <ImagePlus size={28} color="var(--primary)" aria-hidden="true" />
                                    </div>
                                    <p className={styles.dropzoneTitle}>
                                        {isDragging ? 'Drop your image here!' : 'Drag & drop artwork here'}
                                    </p>
                                    <p className={styles.dropzoneHint}>
                                        or click to browse your photos
                                    </p>
                                    <div className={styles.dropzoneButton}>
                                        <Upload size={16} aria-hidden="true" />
                                        Choose File
                                    </div>
                                </>
                            )}
                        </div>

                        {errors.image && (
                            <p className={styles.errorText} role="alert">{errors.image}</p>
                        )}

                        {/* Form */}
                        <div className={styles.form}>
                            {/* Title */}
                            <div className={styles.field}>
                                <label htmlFor="artwork-title" className={styles.label}>
                                    Artwork Title *
                                </label>
                                <input
                                    id="artwork-title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Rainbow Unicorn Adventure"
                                    className={`${styles.input} ${errors.title ? styles.error : ''}`}
                                    aria-invalid={!!errors.title}
                                    aria-describedby={errors.title ? 'title-error' : undefined}
                                />
                                {errors.title && (
                                    <p id="title-error" className={styles.errorText} role="alert">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Artist Selection */}
                            {childProfiles.length > 0 && (
                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Artist *
                                    </label>
                                    <div className={styles.childSelector} role="radiogroup" aria-label="Select artist">
                                        {childProfiles.map((child) => (
                                            <button
                                                key={child.id}
                                                type="button"
                                                onClick={() => handleChildSelect(child.id)}
                                                className={`${styles.childOption} ${formData.childId === child.id ? styles.selected : ''}`}
                                                role="radio"
                                                aria-checked={formData.childId === child.id}
                                            >
                                                <Avatar emoji={child.avatarEmoji || '🎨'} size="sm" />
                                                <span className={styles.childOptionName}>{child.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.childId && (
                                        <p className={styles.errorText} role="alert">
                                            {errors.childId}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Medium & Theme Grid */}
                            <div className={styles.formGrid}>
                                {/* Medium */}
                                <div className={styles.field}>
                                    <label htmlFor="artwork-medium" className={styles.label}>
                                        Medium *
                                    </label>
                                    <select
                                        id="artwork-medium"
                                        name="medium"
                                        value={formData.medium}
                                        onChange={handleInputChange}
                                        className={`${styles.select} ${errors.medium ? styles.error : ''}`}
                                        aria-invalid={!!errors.medium}
                                    >
                                        <option value="">Select medium...</option>
                                        {taxonomy.mediums.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.emoji} {m.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.medium && (
                                        <p className={styles.errorText} role="alert">
                                            {errors.medium}
                                        </p>
                                    )}
                                </div>

                                {/* Theme */}
                                <div className={styles.field}>
                                    <label htmlFor="artwork-theme" className={styles.label}>
                                        Theme <span className={styles.labelHint}>(optional)</span>
                                    </label>
                                    <select
                                        id="artwork-theme"
                                        name="theme"
                                        value={formData.theme}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                    >
                                        <option value="">Select theme...</option>
                                        {taxonomy.themes.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.emoji} {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className={styles.field}>
                                <label htmlFor="artwork-description" className={styles.label}>
                                    Description <span className={styles.labelHint}>(optional)</span>
                                </label>
                                <textarea
                                    id="artwork-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about this artwork..."
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            {errors.submit && (
                                <p className={styles.errorText} role="alert">{errors.submit}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            icon={Palette}
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Upload Artwork
                        </Button>
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}

UploadArtModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpload: PropTypes.func,
    childProfiles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        age: PropTypes.number,
        avatarEmoji: PropTypes.string
    }))
};
