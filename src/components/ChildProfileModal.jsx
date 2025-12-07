import React, { useState } from 'react';
import { X, User, Calendar, FileText, Plus } from 'lucide-react';

export default function ChildProfileModal({ isOpen, onClose, onSave, existingChild = null }) {
    const [formData, setFormData] = useState({
        name: existingChild?.name || '',
        age: existingChild?.age || '',
        description: existingChild?.description || '',
        avatarEmoji: existingChild?.avatarEmoji || '🎨'
    });
    const [errors, setErrors] = useState({});

    const emojiOptions = ['🎨', '🦄', '🚀', '🌟', '🎪', '🦋', '🐱', '🐶', '🌈', '🎸', '⚽', '🎮'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
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

        // Reset form
        setFormData({ name: '', age: '', description: '', avatarEmoji: '🎨' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
                animation: 'fadeIn 0.2s ease'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    width: '100%',
                    maxWidth: '480px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    animation: 'scaleIn 0.3s ease'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--rose))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            {formData.avatarEmoji}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                {existingChild ? 'Edit Artist Profile' : 'Add Young Artist'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Create a profile for your child
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            display: 'flex'
                        }}
                    >
                        <X size={24} color="var(--text-muted)" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    {/* Avatar Emoji Selector */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            Choose an Avatar
                        </label>
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                        }}>
                            {emojiOptions.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, avatarEmoji: emoji }))}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        border: formData.avatarEmoji === emoji
                                            ? '3px solid var(--primary)'
                                            : '2px solid var(--border)',
                                        backgroundColor: formData.avatarEmoji === emoji
                                            ? 'rgba(139, 92, 246, 0.1)'
                                            : 'white',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            <User size={16} />
                            Child's Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Sebastian"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: '0.75rem',
                                border: errors.name ? '2px solid var(--rose)' : '2px solid var(--border)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                        {errors.name && (
                            <p style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Age Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            <Calendar size={16} />
                            Age *
                        </label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="e.g., 4"
                            min="1"
                            max="18"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: '0.75rem',
                                border: errors.age ? '2px solid var(--rose)' : '2px solid var(--border)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                        {errors.age && (
                            <p style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.age}
                            </p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            <FileText size={16} />
                            About (Optional)
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell us about your little artist..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: '0.75rem',
                                border: '2px solid var(--border)',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            e.g., "Loves dinosaurs and painting with bright colors"
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            justifyContent: 'center'
                        }}
                    >
                        <Plus size={20} />
                        {existingChild ? 'Save Changes' : 'Add Artist Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
