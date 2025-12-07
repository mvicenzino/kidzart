import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '@clerk/clerk-react';
import { Plus, Edit2, Trash2, Image, Download, Users } from 'lucide-react';
import { Button, Badge, Avatar } from './ui';
import ChildProfileModal from './ChildProfileModal';
import ImportProfilesModal from './ImportProfilesModal';
import styles from './UserProfileSection.module.css';

export default function UserProfileSection({ children, onAddChild, onEditChild, onDeleteChild, onImportChildren }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState(null);
    const { user } = useUser();

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
        <section className={styles.section} aria-labelledby="artists-title">
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <div className={styles.headerTitle}>
                        <Users size={20} color="var(--primary)" aria-hidden="true" />
                        <h2 id="artists-title" className={styles.title}>
                            Your Young Artists
                        </h2>
                    </div>
                    <p className={styles.subtitle}>
                        Manage profiles for your children's artwork
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={Download}
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        Import from Kindora
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={Plus}
                        onClick={handleAddClick}
                    >
                        Add Child
                    </Button>
                </div>
            </div>

            {/* Children Grid */}
            {children && children.length > 0 ? (
                <div className={styles.childrenGrid}>
                    {children.map((child) => (
                        <article
                            key={child.id}
                            className={`${styles.childCard} ${child.importedFrom ? styles.imported : ''}`}
                        >
                            {/* Imported Badge */}
                            {child.importedFrom && (
                                <div className={styles.importedBadge}>
                                    From Kindora
                                </div>
                            )}

                            <div className={styles.childContent}>
                                {/* Avatar */}
                                <Avatar
                                    emoji={child.avatarEmoji || '🎨'}
                                    size="lg"
                                />

                                {/* Info */}
                                <div className={styles.childInfo}>
                                    <h3 className={styles.childName}>
                                        {child.name}
                                    </h3>
                                    <div className={styles.childBadges}>
                                        <Badge variant="primary">
                                            Age {child.age}
                                        </Badge>
                                        <Badge variant="success">
                                            {getAgeGroup(child.age)}
                                        </Badge>
                                    </div>
                                    {child.description && (
                                        <p className={styles.childDescription}>
                                            {child.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stats & Actions */}
                            <div className={styles.childFooter}>
                                <div className={styles.childStats}>
                                    <Image size={14} aria-hidden="true" />
                                    <span>{child.artworkCount || 0} artworks</span>
                                </div>
                                <div className={styles.childActions}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={Edit2}
                                        onClick={() => handleEditClick(child)}
                                        aria-label={`Edit ${child.name}'s profile`}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={Trash2}
                                        onClick={() => onDeleteChild(child.id)}
                                        aria-label={`Delete ${child.name}'s profile`}
                                        style={{ color: 'var(--rose)' }}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon} aria-hidden="true">
                        🎨
                    </div>
                    <h3 className={styles.emptyTitle}>
                        No artist profiles yet
                    </h3>
                    <p className={styles.emptyDescription}>
                        Add your child's profile to start showcasing their artwork
                    </p>
                    <div className={styles.emptyActions}>
                        <Button
                            variant="outline"
                            icon={Download}
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            Import from Kindora
                        </Button>
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={handleAddClick}
                        >
                            Add Your First Artist
                        </Button>
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

UserProfileSection.propTypes = {
    children: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        description: PropTypes.string,
        avatarEmoji: PropTypes.string,
        artworkCount: PropTypes.number,
        importedFrom: PropTypes.string
    })),
    onAddChild: PropTypes.func.isRequired,
    onEditChild: PropTypes.func.isRequired,
    onDeleteChild: PropTypes.func.isRequired,
    onImportChildren: PropTypes.func
};
