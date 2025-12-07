import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, ChevronDown, Filter } from 'lucide-react';
import styles from './FilterBar.module.css';

export default function FilterBar({
    taxonomy,
    activeFilters,
    onFilterChange,
    onClearFilters
}) {
    const [expandedSection, setExpandedSection] = useState(null);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const optionRefs = useRef({});

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
                setFocusedOptionIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus option when index changes
    useEffect(() => {
        if (expandedSection && focusedOptionIndex >= 0) {
            const optionEl = optionRefs.current[`${expandedSection}-${focusedOptionIndex}`];
            if (optionEl) {
                optionEl.focus();
            }
        }
    }, [focusedOptionIndex, expandedSection]);

    const toggleSection = (sectionId) => {
        if (expandedSection === sectionId) {
            setExpandedSection(null);
            setFocusedOptionIndex(-1);
        } else {
            setExpandedSection(sectionId);
            setFocusedOptionIndex(0);
        }
    };

    const handleFilterSelect = (filterId, value) => {
        onFilterChange(filterId, value);
        setExpandedSection(null);
        setFocusedOptionIndex(-1);
    };

    const handleKeyDown = useCallback((e, sectionId, options) => {
        const totalOptions = options.length + 1; // +1 for "All" option

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedOptionIndex(prev => (prev + 1) % totalOptions);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedOptionIndex(prev => (prev - 1 + totalOptions) % totalOptions);
                break;
            case 'Escape':
                e.preventDefault();
                setExpandedSection(null);
                setFocusedOptionIndex(-1);
                break;
            case 'Home':
                e.preventDefault();
                setFocusedOptionIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setFocusedOptionIndex(totalOptions - 1);
                break;
        }
    }, []);

    return (
        <div className={styles.filterBar} ref={dropdownRef}>
            {/* Filter Pills */}
            <div className={styles.filterRow} role="group" aria-label="Gallery filters">
                {/* Filter Label */}
                <div className={styles.filterLabel}>
                    <Filter size={16} aria-hidden="true" />
                    <span>Filter</span>
                </div>

                {filterSections.map((section) => {
                    const isActive = activeFilters[section.id] && activeFilters[section.id] !== 'all';
                    const activeOption = isActive
                        ? section.options.find(o => o.id === activeFilters[section.id])
                        : null;
                    const isExpanded = expandedSection === section.id;

                    return (
                        <div key={section.id} className={styles.filterWrapper}>
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
                                aria-expanded={isExpanded}
                                aria-haspopup="listbox"
                                aria-controls={`${section.id}-listbox`}
                            >
                                {activeOption && <span aria-hidden="true">{activeOption.emoji}</span>}
                                <span>{isActive ? activeOption?.label : section.label}</span>
                                <ChevronDown
                                    size={14}
                                    className={`${styles.chevron} ${isExpanded ? styles.open : ''}`}
                                    aria-hidden="true"
                                />
                            </button>

                            {/* Dropdown */}
                            {isExpanded && (
                                <div
                                    role="listbox"
                                    id={`${section.id}-listbox`}
                                    aria-label={`Filter by ${section.label}`}
                                    className={styles.dropdown}
                                    onKeyDown={(e) => handleKeyDown(e, section.id, section.options)}
                                >
                                    {/* All Option */}
                                    <button
                                        ref={el => optionRefs.current[`${section.id}-0`] = el}
                                        onClick={() => handleFilterSelect(section.id, 'all')}
                                        className={`${styles.dropdownOption} ${styles.allOption} ${!isActive ? styles.active : ''}`}
                                        role="option"
                                        aria-selected={!isActive}
                                        tabIndex={focusedOptionIndex === 0 ? 0 : -1}
                                    >
                                        All {section.label}s
                                    </button>

                                    <div className={styles.divider} role="separator" />

                                    {/* Options */}
                                    {section.options.map((option, index) => (
                                        <button
                                            key={option.id}
                                            ref={el => optionRefs.current[`${section.id}-${index + 1}`] = el}
                                            onClick={() => handleFilterSelect(section.id, option.id)}
                                            className={`${styles.dropdownOption} ${activeFilters[section.id] === option.id ? styles.active : ''}`}
                                            role="option"
                                            aria-selected={activeFilters[section.id] === option.id}
                                            tabIndex={focusedOptionIndex === index + 1 ? 0 : -1}
                                        >
                                            <span className={styles.optionEmoji} aria-hidden="true">{option.emoji}</span>
                                            <div className={styles.optionLabel}>
                                                <span>{option.label}</span>
                                                {option.sublabel && (
                                                    <span className={styles.optionSublabel}>{option.sublabel}</span>
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
                        className={styles.clearButton}
                        aria-label={`Clear all ${activeFilterCount} filters`}
                    >
                        <X size={14} aria-hidden="true" />
                        Clear ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
                <div className={styles.activeFiltersRow} role="region" aria-label="Active filters">
                    <span className={styles.activeLabel}>Active:</span>
                    {Object.entries(activeFilters).map(([key, value]) => {
                        if (!value || value === 'all') return null;
                        const section = filterSections.find(s => s.id === key);
                        const option = section?.options.find(o => o.id === value);
                        if (!option) return null;

                        return (
                            <span key={key} className={styles.activeFilterPill}>
                                <span aria-hidden="true">{option.emoji}</span>
                                {option.label}
                                <button
                                    onClick={() => onFilterChange(key, 'all')}
                                    className={styles.removeFilterButton}
                                    aria-label={`Remove ${option.label} filter`}
                                >
                                    <X size={14} aria-hidden="true" />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

FilterBar.propTypes = {
    taxonomy: PropTypes.shape({
        ageGroups: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            range: PropTypes.string,
            emoji: PropTypes.string
        })).isRequired,
        mediums: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            emoji: PropTypes.string
        })).isRequired,
        themes: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            emoji: PropTypes.string
        })).isRequired
    }).isRequired,
    activeFilters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired
};
