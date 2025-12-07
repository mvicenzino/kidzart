import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Filter } from 'lucide-react';

export default function FilterBar({
    taxonomy,
    activeFilters,
    onFilterChange,
    onClearFilters
}) {
    const [expandedSection, setExpandedSection] = useState(null);
    const dropdownRef = useRef(null);

    const filterSections = [
        {
            id: 'ageGroup',
            label: 'Age',
            options: taxonomy.ageGroups.map(ag => ({
                id: ag.id,
                label: ag.label,
                sublabel: ag.range,
                emoji: ag.emoji
            }))
        },
        {
            id: 'medium',
            label: 'Medium',
            options: taxonomy.mediums.map(m => ({
                id: m.id,
                label: m.label,
                emoji: m.emoji
            }))
        },
        {
            id: 'theme',
            label: 'Theme',
            options: taxonomy.themes.map(t => ({
                id: t.id,
                label: t.label,
                emoji: t.emoji
            }))
        }
    ];

    const activeFilterCount = Object.values(activeFilters).filter(v => v !== null && v !== 'all').length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setExpandedSection(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    const handleFilterSelect = (filterId, value) => {
        onFilterChange(filterId, value);
        setExpandedSection(null);
    };

    return (
        <div style={{ marginBottom: 'var(--space-6)' }} ref={dropdownRef}>
            {/* Filter Pills */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-2)',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {/* Filter Icon - Mobile indicator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    <Filter size={16} />
                    <span>Filter</span>
                </div>

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
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-2) var(--space-4)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: isActive ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                                    backgroundColor: isActive ? 'var(--primary-bg)' : 'var(--surface)',
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)'
                                }}
                            >
                                {activeOption && (
                                    <span>{activeOption.emoji}</span>
                                )}
                                <span>
                                    {isActive ? activeOption?.label : section.label}
                                </span>
                                <ChevronDown
                                    size={14}
                                    style={{
                                        transform: expandedSection === section.id ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform var(--transition-fast)'
                                    }}
                                />
                            </button>

                            {/* Dropdown */}
                            {expandedSection === section.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + var(--space-2))',
                                    left: 0,
                                    backgroundColor: 'var(--surface)',
                                    borderRadius: 'var(--radius-xl)',
                                    boxShadow: 'var(--shadow-xl)',
                                    border: '1px solid var(--border-light)',
                                    minWidth: '200px',
                                    maxHeight: '320px',
                                    overflowY: 'auto',
                                    zIndex: 50,
                                    padding: 'var(--space-2)',
                                    animation: 'slideUp 0.2s ease'
                                }}>
                                    {/* All Option */}
                                    <button
                                        onClick={() => handleFilterSelect(section.id, 'all')}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3) var(--space-4)',
                                            textAlign: 'left',
                                            border: 'none',
                                            backgroundColor: !isActive ? 'var(--surface-alt)' : 'transparent',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            fontWeight: !isActive ? '600' : '400',
                                            color: 'var(--text-main)',
                                            fontSize: '0.875rem',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        All {section.label}s
                                    </button>

                                    {/* Divider */}
                                    <div style={{
                                        height: '1px',
                                        backgroundColor: 'var(--border-light)',
                                        margin: 'var(--space-2) 0'
                                    }} />

                                    {/* Options */}
                                    {section.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleFilterSelect(section.id, option.id)}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3) var(--space-4)',
                                                textAlign: 'left',
                                                border: 'none',
                                                backgroundColor: activeFilters[section.id] === option.id
                                                    ? 'var(--primary-bg)'
                                                    : 'transparent',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                fontWeight: activeFilters[section.id] === option.id ? '600' : '400',
                                                color: activeFilters[section.id] === option.id
                                                    ? 'var(--primary)'
                                                    : 'var(--text-main)',
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                transition: 'all var(--transition-fast)'
                                            }}
                                        >
                                            <span style={{ fontSize: '1rem' }}>{option.emoji}</span>
                                            <div>
                                                <div>{option.label}</div>
                                                {option.sublabel && (
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                        marginTop: '2px'
                                                    }}>
                                                        {option.sublabel}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-1)',
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-lg)',
                            border: 'none',
                            backgroundColor: 'var(--rose)',
                            color: 'white',
                            fontWeight: '500',
                            fontSize: '0.8125rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        <X size={14} />
                        Clear ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
                <div style={{
                    marginTop: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.8125rem',
                        fontWeight: '500'
                    }}>
                        Active:
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
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-1) var(--space-3)',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.8125rem',
                                    fontWeight: '500'
                                }}
                            >
                                <span>{option.emoji}</span>
                                {option.label}
                                <button
                                    onClick={() => onFilterChange(key, 'all')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        opacity: 0.8
                                    }}
                                    aria-label={`Remove ${option.label} filter`}
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
