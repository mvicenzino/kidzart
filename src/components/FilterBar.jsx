import React from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function FilterBar({
    taxonomy,
    activeFilters,
    onFilterChange,
    onClearFilters
}) {
    const [expandedSection, setExpandedSection] = React.useState(null);

    const filterSections = [
        {
            id: 'ageGroup',
            label: 'Age Group',
            icon: '👶',
            options: taxonomy.ageGroups.map(ag => ({ id: ag.id, label: `${ag.emoji} ${ag.label}`, sublabel: ag.range }))
        },
        {
            id: 'medium',
            label: 'Medium',
            icon: '🎨',
            options: taxonomy.mediums.map(m => ({ id: m.id, label: `${m.emoji} ${m.label}` }))
        },
        {
            id: 'theme',
            label: 'Theme',
            icon: '✨',
            options: taxonomy.themes.map(t => ({ id: t.id, label: `${t.emoji} ${t.label}` }))
        }
    ];

    const activeFilterCount = Object.values(activeFilters).filter(v => v !== null && v !== 'all').length;

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    const handleFilterSelect = (filterId, value) => {
        onFilterChange(filterId, value);
        setExpandedSection(null);
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            {/* Filter Pills Row */}
            <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {filterSections.map((section) => {
                    const isActive = activeFilters[section.id] && activeFilters[section.id] !== 'all';
                    const activeOption = isActive
                        ? section.options.find(o => o.id === activeFilters[section.id])
                        : null;

                    return (
                        <div key={section.id} style={{ position: 'relative' }}>
                            <button
                                onClick={() => toggleSection(section.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '999px',
                                    border: isActive ? '2px solid var(--primary)' : '2px solid var(--border)',
                                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'white',
                                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>{section.icon}</span>
                                <span>{isActive ? activeOption?.label : section.label}</span>
                                <ChevronDown
                                    size={16}
                                    style={{
                                        transform: expandedSection === section.id ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform 0.2s'
                                    }}
                                />
                            </button>

                            {/* Dropdown */}
                            {expandedSection === section.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    left: 0,
                                    backgroundColor: 'white',
                                    borderRadius: '1rem',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                    border: '1px solid var(--border)',
                                    minWidth: '200px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    zIndex: 50,
                                    padding: '0.5rem'
                                }}>
                                    <button
                                        onClick={() => handleFilterSelect(section.id, 'all')}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            textAlign: 'left',
                                            border: 'none',
                                            backgroundColor: !isActive ? 'var(--surface-alt)' : 'transparent',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            fontWeight: !isActive ? '600' : '400',
                                            color: 'var(--text-main)',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        All {section.label}s
                                    </button>
                                    {section.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleFilterSelect(section.id, option.id)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                textAlign: 'left',
                                                border: 'none',
                                                backgroundColor: activeFilters[section.id] === option.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                fontWeight: activeFilters[section.id] === option.id ? '600' : '400',
                                                color: activeFilters[section.id] === option.id ? 'var(--primary)' : 'var(--text-main)',
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <span>{option.label}</span>
                                            {option.sublabel && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{option.sublabel}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Clear Filters Button */}
                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 1rem',
                            borderRadius: '999px',
                            border: 'none',
                            backgroundColor: 'var(--rose)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={16} />
                        Clear ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--surface-alt)',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
                        Showing:
                    </span>
                    {Object.entries(activeFilters).map(([key, value]) => {
                        if (!value || value === 'all') return null;
                        const section = filterSections.find(s => s.id === key);
                        const option = section?.options.find(o => o.id === value);
                        if (!option) return null;

                        return (
                            <span
                                key={key}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.35rem 0.75rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}
                            >
                                {option.label}
                                <button
                                    onClick={() => onFilterChange(key, 'all')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex'
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
