import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ArtCard from './components/ArtCard';
import ArtModal from './components/ArtModal';
import FilterBar from './components/FilterBar';
import ProfilePage from './pages/ProfilePage';
import { useArtworks } from './hooks/useArtworks';
import { taxonomy } from './data/mockData';
import { Sparkles, ArrowRight, Palette, Users, Heart } from 'lucide-react';

// Home Page Component
function HomePage() {
  const { artworks } = useArtworks();
  const [selectedArt, setSelectedArt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    ageGroup: 'all',
    medium: 'all',
    theme: 'all'
  });

  const handleArtClick = (artwork) => {
    setSelectedArt(artwork);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArt(null);
  };

  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ ageGroup: 'all', medium: 'all', theme: 'all' });
  };

  // Filter artworks based on active filters
  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => !art.highlight).filter(art => {
      if (filters.ageGroup !== 'all' && art.ageGroup !== filters.ageGroup) return false;
      if (filters.medium !== 'all' && art.medium !== filters.medium) return false;
      if (filters.theme !== 'all' && art.theme !== filters.theme) return false;
      return true;
    });
  }, [artworks, filters]);

  const highlightedArtworks = artworks.filter(art => art.highlight);
  const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

  return (
    <>
      {/* Hero Section - Clean and Focused */}
      <header style={{
        padding: 'var(--space-20) 0 var(--space-16)',
        background: 'linear-gradient(180deg, #F8FAFF 0%, var(--background) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Decoration */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          {/* Tagline Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            backgroundColor: 'var(--primary-bg)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-6)'
          }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: 'var(--primary)'
            }}>
              The World's Largest Kids Art Museum
            </span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            marginBottom: 'var(--space-6)',
            background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            maxWidth: '800px',
            marginInline: 'auto'
          }}>
            Where Little Masterpieces <br /> Get the <span style={{ color: 'var(--primary)' }}>Big Stage</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-10)',
            maxWidth: '600px',
            marginInline: 'auto',
            lineHeight: '1.6'
          }}>
            Store, organize, and showcase your child's artwork in a beautiful digital gallery.
            Share with family, celebrate creativity, and keep the clutter off the fridge.
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            marginBottom: 'var(--space-16)'
          }}>
            <button className="btn btn-primary btn-lg">
              Start Your Gallery
              <ArrowRight size={20} />
            </button>
            <button className="btn btn-outline btn-lg">
              View Collection
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-12)',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: Palette, value: '1,200+', label: 'Artworks' },
              { icon: Users, value: '450+', label: 'Young Artists' },
              { icon: Heart, value: '15k+', label: 'Appreciations' }
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'white',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon size={20} color="var(--primary)" />
                </div>
                <div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    lineHeight: '1.2'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Highlights Section */}
      <section id="highlights" style={{
        background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 50%, #FEF3C7 100%)',
        padding: 'var(--space-16) 0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--space-3)'
              }}>
                <Sparkles size={12} color="var(--primary)" />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Featured This Week
                </span>
              </div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-main)',
                margin: 0
              }}>
                Curator's Picks
              </h2>
            </div>
            <a href="#gallery" style={{
              color: 'var(--primary)',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              View all artworks <ArrowRight size={16} />
            </a>
          </div>

          <div className="gallery-grid" style={{ marginBottom: 0 }}>
            {highlightedArtworks.map((artwork) => (
              <ArtCard
                key={artwork.id}
                artwork={artwork}
                onClick={() => handleArtClick(artwork)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <main id="main-content" className="container" style={{
        padding: 'var(--space-16) var(--space-6)',
        flex: 1
      }}>
        {/* Section Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-main)',
            marginBottom: 'var(--space-2)'
          }}>
            Explore the Gallery
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1rem'
          }}>
            Discover amazing creations from young artists around the world
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          taxonomy={taxonomy}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Mobile Active Filters Summary (if needed) */}
        {hasActiveFilters && (
          <div style={{
            display: 'none', // Hidden on desktop, could be shown on mobile if needed
            marginBottom: 'var(--space-4)'
          }}>
          </div>
        )}

        {/* Gallery Grid */}
        {filteredArtworks.length > 0 ? (
          <div className="gallery-grid">
            {filteredArtworks.map((artwork) => (
              <ArtCard
                key={artwork.id}
                artwork={artwork}
                onClick={() => handleArtClick(artwork)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-12)',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: 'var(--radius-xl)',
            marginTop: 'var(--space-6)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎨</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-main)',
              marginBottom: 'var(--space-2)'
            }}>
              No masterpieces found
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>
              Try adjusting your filters to see more artwork.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn btn-outline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Art Modal */}
      <ArtModal
        artwork={selectedArt}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

// Main App with Routes
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
