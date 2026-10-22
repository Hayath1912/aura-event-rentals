import React, { useMemo, useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    categories,
    vendors,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedVendorFilter,
    setSelectedVendorFilter,
    searchQuery,
  } = useMarketplace();

  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'stock'>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryFilter && p.categoryId !== selectedCategoryFilter) {
        return false;
      }
      // Vendor filter
      if (selectedVendorFilter && p.vendorId !== selectedVendorFilter) {
        return false;
      }
      // Available only
      if (onlyAvailable && p.availableQuantity <= 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.categoryName.toLowerCase().includes(q);
        const matchesVendor = p.vendorName.toLowerCase().includes(q);
        const matchesTag = p.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesCode = p.itemCode.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesVendor && !matchesTag && !matchesCode) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.rentalPrice - b.rentalPrice;
      if (sortBy === 'price_desc') return b.rentalPrice - a.rentalPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'stock') return b.availableQuantity - a.availableQuantity;
      // Default: featured first, then review count
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.reviewCount - a.reviewCount;
    });
  }, [products, selectedCategoryFilter, selectedVendorFilter, onlyAvailable, searchQuery, sortBy]);

  return (
    <section id="catalog-section" style={{
      padding: '24px 24px 60px',
      maxWidth: '1440px',
      margin: '0 auto',
    }}>
      {/* Filter & Sort Controls Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e7e5e4',
        padding: '16px 20px',
        marginBottom: '28px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: selectedCategoryFilter === null ? '#065f46' : '#f5f5f4',
              color: selectedCategoryFilter === null ? '#ffffff' : '#57534e',
              transition: 'all 0.15s ease',
            }}
          >
            All Catalog ({products.length})
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryFilter(c.id === selectedCategoryFilter ? null : c.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selectedCategoryFilter === c.id ? '#065f46' : '#f5f5f4',
                color: selectedCategoryFilter === c.id ? '#ffffff' : '#57534e',
                transition: 'all 0.15s ease',
              }}
            >
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Right Dropdowns: Vendor + Sort + InStock Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Vendor Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#78716c', fontWeight: 600 }}>Vendor:</span>
            <select
              value={selectedVendorFilter || ''}
              onChange={(e) => setSelectedVendorFilter(e.target.value ? e.target.value : null)}
              style={{
                backgroundColor: '#f5f5f4',
                border: '1px solid #e7e5e4',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1c1917',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Certified Vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.businessName}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={13} style={{ color: '#78716c' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                backgroundColor: '#f5f5f4',
                border: '1px solid #e7e5e4',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1c1917',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">Featured & Best Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="stock">Highest Available Stock</option>
            </select>
          </div>

          {/* In Stock Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#44403c' }}>
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              style={{ accentColor: '#065f46' }}
            />
            Available Only
          </label>
        </div>
      </div>

      {/* Results Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>
          Showing {filteredProducts.length} Premium Event Props & Decor
        </div>

        {searchQuery && (
          <div style={{ fontSize: '13px', color: '#78716c' }}>
            Matching: "<strong style={{ color: '#065f46' }}>{searchQuery}</strong>"
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px dashed #d6d3d1',
          padding: '60px 24px',
          textAlign: 'center',
        }}>
          <Sparkles size={36} style={{ color: '#a8a29e', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', marginBottom: '6px' }}>
            No matching event items found
          </h3>
          <p style={{ fontSize: '14px', color: '#78716c', maxWidth: '400px', margin: '0 auto 16px' }}>
            Try broadening your search or clear selected category / vendor filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategoryFilter(null);
              setSelectedVendorFilter(null);
              setOnlyAvailable(false);
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#065f46',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
