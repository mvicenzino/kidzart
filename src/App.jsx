import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import ArtCard from './components/ArtCard';
import ArtModal from './components/ArtModal';
import FilterBar from './components/FilterBar';
import { artworks, taxonomy } from './data/mockData';
import { Sparkles, Rocket, Gift, Palette } from 'lucide-react';

function App() {
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

  const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <header style={{
        padding: '6rem 0',
        background: 'linear-gradient(to bottom, #FDFBF7, #FEF3C7)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.1)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(56, 189, 248, 0.1)',
          filter: 'blur(40px)'
        }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--surface-alt)'
          }}>
            <Sparkles size={16} color="var(--secondary)" />
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>The world's happiest art gallery</span>
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            letterSpacing: '-0.03em'
          }}>
            Where Little Imaginations<br />
            <span className="text-gradient">Run Wild & Free</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            Kidzart is the safe, fun place for parents to showcase their children's creativity.
            Upload drawings, paintings, and crafts to share with family and friends!
          </p>

          {/* Donation Message */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: '#FEF3C7',
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            marginBottom: '2rem',
            border: '2px solid #FCD34D'
          }}>
            <Gift size={20} color="#D97706" />
            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#92400E' }}>
              💛 All donations go directly to families to support education & creativity
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#gallery"
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', fontSize: '1.125rem', textDecoration: 'none' }}
            >
              <Palette size={20} />
              Browse Gallery
            </a>
            <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              <Rocket size={20} />
              Add Your Art
            </button>
          </div>

          {/* Gallery Stats */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            justifyContent: 'center',
            marginTop: '3rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>50+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Artworks</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>25+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Young Artists</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>$1.2k</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Donated</div>
            </div>
          </div>
        </div>
      </header>

      {/* Highlights Section - Sebastian's Art */}
      <section style={{
        background: 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 50%, #FEF3C7 100%)',
        padding: '4rem 0'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--rose))',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Sparkles size={18} color="white" />
              <span style={{ color: 'white', fontWeight: '700', fontSize: '0.875rem' }}>HIGHLIGHTS</span>
            </div>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            ✨ Sebastian's Gallery
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Featured artwork from our rising star artist, age 4
          </p>

          <div className="grid-gallery">
            {artworks.filter(art => art.highlight).map((art) => (
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
      <main id="gallery" className="container" style={{ padding: '4rem 1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Palette size={28} color="var(--primary)" />
            <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Explore the Gallery</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Discover artwork by age, medium, and theme from young artists around the world.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          taxonomy={taxonomy}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results Count */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Showing <strong style={{ color: 'var(--text-main)' }}>{filteredArtworks.length}</strong> masterpiece{filteredArtworks.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' matching your filters'}
          </span>
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
            padding: '4rem 2rem',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: '1.5rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              No artwork found
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Try adjusting your filters to discover more masterpieces!
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
        backgroundColor: 'white',
        borderTop: '1px solid var(--border)',
        padding: '3rem 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '0.5rem' }}>
            © 2024 Kidzart. Made with 💜 for little artists everywhere.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            A <span style={{ fontWeight: '600' }}>Kindora Family, Inc.</span> company. All rights reserved.
          </p>
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

export default App;
