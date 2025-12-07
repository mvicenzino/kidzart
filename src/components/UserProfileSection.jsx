import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Plus, Edit2, Trash2, Palette, Image } from 'lucide-react';
import ChildProfileModal from './ChildProfileModal';

export default function UserProfileSection({ children, onAddChild, onEditChild, onDeleteChild }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState(null);

    let user = null;
    try {
        const clerkUser = useUser();
        user = clerkUser.user;
    } catch (e) {
        // Clerk not configured
    }

    const handleAddClick = () => {
        setEditingChild(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (child) => {
        setEditingChild(child);
        setIsModalOpen(true);
    };

    const handleSave = (childData) => {
        if (editingChild) {
            onEditChild(childData);
        } else {
            onAddChild(childData);
        }
    };

    const getAgeGroup = (age) => {
        if (age <= 3) return 'Toddler';
        if (age <= 5) return 'Preschool';
        if (age <= 7) return 'Early Elementary';
        if (age <= 9) return 'Elementary';
        return 'Tween';
    };

    return (
        <section style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        👨‍👩‍👧 Your Young Artists
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Manage profiles for your children's artwork
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="btn btn-primary"
                    style={{ gap: '0.5rem' }}
                >
                    <Plus size={18} />
                    Add Child
                </button>
            </div>

            {/* Children Grid */}
            {children && children.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1rem'
                }}>
                    {children.map((child) => (
                        <div
                            key={child.id}
                            style={{
                                backgroundColor: 'var(--surface)',
                                borderRadius: '1rem',
                                padding: '1.25rem',
                                border: '1px solid var(--border)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.75rem',
                                    flexShrink: 0
                                }}>
                                    {child.avatarEmoji || '🎨'}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {child.name}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            Age {child.age}
                                        </span>
                                        <span style={{
                                            backgroundColor: 'var(--secondary)',
                                            color: '#78350F',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {getAgeGroup(child.age)}
                                        </span>
                                    </div>
                                    {child.description && (
                                        <p style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '0.85rem',
                                            lineHeight: 1.4
                                        }}>
                                            {child.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stats & Actions */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Image size={16} />
                                        <span>{child.artworkCount || 0} artworks</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEditClick(child)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            color: 'var(--text-muted)',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Edit profile"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteChild(child.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            color: 'var(--rose)',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Delete profile"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    backgroundColor: 'var(--surface-alt)',
                    borderRadius: '1rem'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        No artist profiles yet
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Add your child's profile to start showcasing their artwork!
                    </p>
                    <button
                        onClick={handleAddClick}
                        className="btn btn-primary"
                    >
                        <Plus size={18} />
                        Add Your First Artist
                    </button>
                </div>
            )}

            {/* Modal */}
            <ChildProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                existingChild={editingChild}
            />
        </section>
    );
}
