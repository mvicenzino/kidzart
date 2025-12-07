import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ArtCard from './components/ArtCard';
import ArtModal from './components/ArtModal';
import FilterBar from './components/FilterBar';
import ProfilePage from './pages/ProfilePage';
import { artworks, taxonomy } from './data/mockData';
import { Sparkles, ArrowRight, Palette, Users, Heart } from 'lucide-react';

// Home Page Component
function HomePage() {
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
  }, [filters]);

  const highlightedArtworks = artworks.filter(art => art.highlight);
  const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

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
              Celebrating Young Creativity
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '800',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--space-4)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)'
          }}>
            Where Little Artists<br />
            <span className="text-gradient">Shine Bright</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-muted)',
            maxWidth: '540px',
            margin: '0 auto var(--space-8)',
            lineHeight: 1.7
          }}>
            A safe gallery for parents to showcase their children's artwork
            and connect with a community that appreciates young creativity.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a
              href="#gallery"
              className="btn btn-primary btn-lg"
            >
              <Palette size={18} />
              Browse Gallery
            </a>
            <a
              href="#highlights"
              className="btn btn-outline btn-lg"
            >
              Featured Artists
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-10)',
            justifyContent: 'center',
            marginTop: 'var(--space-12)',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: Palette, value: '50+', label: 'Artworks' },
              { icon: Users, value: '25+', label: 'Young Artists' },
              { icon: Heart, value: '1.2k', label: 'Likes' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon size={20} color="var(--primary)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: '1.375rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    lineHeight: 1.2
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    fontWeight: '500'
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
                <Sparkles size={14} color="var(--primary)" />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Featured
                </span>
              </div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-main)',
                marginBottom: 'var(--space-1)'
              }}>
                Sebastian's Gallery
              </h2>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.9375rem'
              }}>
                Featured artwork from our rising star, age 4
              </p>
            </div>
          </div>

          <div className="grid-gallery">
            {highlightedArtworks.map((art) => (
              <ArtCard
                key={art.id}
                artwork={art}
                onClick={() => handleArtClick(art)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <main id="gallery" className="container" style={{
        padding: 'var(--space-16) var(--space-6)',
        flex: 1
      }}>
        {/* Section Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-main)',
            marginBottom: 'var(--space-2)'
          }}>
            Explore the Gallery
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.9375rem'
          }}>
            Discover amazing artwork from young artists around the world
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          taxonomy={taxonomy}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results Info */}
        <div style={{
          marginBottom: 'var(--space-6)',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          Showing <strong style={{ color: 'var(--text-main)' }}>{filteredArtworks.length}</strong> masterpiece{filteredArtworks.length !== 1 ? 's' : ''}
          {hasActiveFilters && ' matching your filters'}
        </div>

        {/* Gallery Grid */}
        {filteredArtworks.length > 0 ? (
          <div className="grid-gallery">
            {filteredArtworks.map((art) => (
              <ArtCard
                key={art.id}
                artwork={art}
                onClick={() => handleArtClick(art)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-16) var(--space-8)',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: 'var(--space-4)'
            }}>🎨</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)',
              color: 'var(--text-main)'
            }}>
              No artwork found
            </h3>
            <p style={{
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-6)'
            }}>
              Try adjusting your filters to discover more masterpieces
            </p>
            <button
              onClick={handleClearFilters}
              className="btn btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border-light)',
        padding: 'var(--space-10) 0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                padding: '0.375rem',
                borderRadius: '8px',
                color: 'white',
                display: 'flex'
              }}>
                <Palette size={18} />
              </div>
              <span style={{
                fontWeight: '700',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-main)'
              }}>
                Kidzart
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--space-6)',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <a href="#gallery" style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}>Gallery</a>
              <a href="#highlights" style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}>Featured</a>
              <a href="/profile" style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}>My Artists</a>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-light)',
            marginTop: 'var(--space-8)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-2)'
          }}>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.8125rem'
            }}>
              © 2024 Kidzart. Made with 💜 for little artists everywhere.
            </p>
            <p style={{
              color: 'var(--text-light)',
              fontSize: '0.8125rem'
            }}>
              A <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Kindora</span> product
            </p>
          </div>
        </div>
      </footer>

      {/* Art Modal */}
      <ArtModal
        artwork={selectedArt}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

// Main App with Routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
