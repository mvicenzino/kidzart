import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Plus, Edit2, Trash2, Image, Download, Users } from 'lucide-react';
import ChildProfileModal from './ChildProfileModal';
import ImportProfilesModal from './ImportProfilesModal';

export default function UserProfileSection({ children, onAddChild, onEditChild, onDeleteChild, onImportChildren }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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

    const handleImport = (profiles) => {
        if (onImportChildren) {
            onImportChildren(profiles);
        } else {
            profiles.forEach(profile => onAddChild(profile));
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
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-6)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 'var(--space-6)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-5)',
                flexWrap: 'wrap',
                gap: 'var(--space-4)'
            }}>
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        marginBottom: 'var(--space-1)'
                    }}>
                        <Users size={20} color="var(--primary)" />
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text-main)'
                        }}>
                            Your Young Artists
                        </h2>
                    </div>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem'
                    }}>
                        Manage profiles for your children's artwork
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="btn btn-outline btn-sm"
                    >
                        <Download size={16} />
                        Import from Kindora
                    </button>
                    <button
                        onClick={handleAddClick}
                        className="btn btn-primary btn-sm"
                    >
                        <Plus size={16} />
                        Add Child
                    </button>
                </div>
            </div>

            {/* Children Grid */}
            {children && children.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-4)'
                }}>
                    {children.map((child) => (
                        <div
                            key={child.id}
                            style={{
                                backgroundColor: 'var(--background)',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-5)',
                                border: child.importedFrom
                                    ? '1.5px solid var(--primary)'
                                    : '1px solid var(--border-light)',
                                transition: 'all var(--transition-fast)',
                                position: 'relative'
                            }}
                        >
                            {/* Imported Badge */}
                            {child.importedFrom && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: 'var(--space-4)',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    padding: 'var(--space-1) var(--space-3)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.6875rem',
                                    fontWeight: '600'
                                }}>
                                    From Kindora
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-4)'
                            }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    flexShrink: 0
                                }}>
                                    {child.avatarEmoji || '🎨'}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        marginBottom: 'var(--space-2)',
                                        color: 'var(--text-main)'
                                    }}>
                                        {child.name}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        gap: 'var(--space-2)',
                                        alignItems: 'center',
                                        marginBottom: 'var(--space-2)',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span className="badge badge-primary">
                                            Age {child.age}
                                        </span>
                                        <span className="badge badge-success">
                                            {getAgeGroup(child.age)}
                                        </span>
                                    </div>
                                    {child.description && (
                                        <p style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '0.8125rem',
                                            lineHeight: 1.5
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
                                marginTop: 'var(--space-4)',
                                paddingTop: 'var(--space-4)',
                                borderTop: '1px solid var(--border-light)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8125rem'
                                }}>
                                    <Image size={14} />
                                    <span>{child.artworkCount || 0} artworks</span>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                    <button
                                        onClick={() => handleEditClick(child)}
                                        className="btn btn-ghost btn-icon"
                                        style={{ width: '32px', height: '32px' }}
                                        title="Edit profile"
                                        aria-label="Edit profile"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteChild(child.id)}
                                        className="btn btn-ghost btn-icon"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            color: 'var(--rose)'
                                        }}
                                        title="Delete profile"
                                        aria-label="Delete profile"
                                    >
                                        <Trash2 size={16} />
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
                    padding: 'var(--space-12) var(--space-8)',
                    backgroundColor: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-xl)'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--space-4)',
                        fontSize: '1.75rem'
                    }}>
                        🎨
                    </div>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: 'var(--space-2)',
                        color: 'var(--text-main)'
                    }}>
                        No artist profiles yet
                    </h3>
                    <p style={{
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--space-6)',
                        maxWidth: '360px',
                        margin: '0 auto var(--space-6)',
                        fontSize: '0.9375rem'
                    }}>
                        Add your child's profile to start showcasing their artwork
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-3)',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="btn btn-outline"
                        >
                            <Download size={16} />
                            Import from Kindora
                        </button>
                        <button
                            onClick={handleAddClick}
                            className="btn btn-primary"
                        >
                            <Plus size={16} />
                            Add Your First Artist
                        </button>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            <ChildProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                existingChild={editingChild}
            />

            {/* Import Modal */}
            <ImportProfilesModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </section>
    );
}
