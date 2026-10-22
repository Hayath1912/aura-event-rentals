import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { InventoryItem, Category } from '../../types';
import { ProductCard } from './ProductCard';

interface CatalogGridProps {
  items: InventoryItem[];
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onSelectItem: (item: InventoryItem) => void;
  onQuickAdd: (item: InventoryItem) => void;
  cartItemIds: Set<string>;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  items,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onSelectItem,
  onQuickAdd,
  cartItemIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by Category
    if (selectedCategoryId) {
      result = result.filter((it) => it.category_id === selectedCategoryId);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.sku.toLowerCase().includes(q) ||
          it.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.rental_price - b.rental_price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.rental_price - a.rental_price);
    }

    return result;
  }, [items, selectedCategoryId, searchQuery, sortBy]);

  return (
    <section id="catalog-section" style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px 80px 24px' }}>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          padding: '16px 20px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 320px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '14px' }} />
          <input
            type="text"
            placeholder="Search props by name, SKU (e.g. WW-CT), or material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              fontSize: '14px',
              color: 'var(--color-text)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '14px', color: 'var(--color-text-muted)' }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort & Count Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {filteredItems.length} items found
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={14} color="var(--color-text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => onSelectCategory(null)}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: selectedCategoryId === null ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
            backgroundColor: selectedCategoryId === null ? 'var(--color-accent)' : 'var(--color-surface)',
            color: selectedCategoryId === null ? '#ffffff' : 'var(--color-text)',
            fontSize: '12px',
            fontWeight: 700,
            transition: 'all 0.15s ease',
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id === selectedCategoryId ? null : cat.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: cat.id === selectedCategoryId ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              backgroundColor: cat.id === selectedCategoryId ? 'var(--color-accent)' : 'var(--color-surface)',
              color: cat.id === selectedCategoryId ? '#ffffff' : 'var(--color-text)',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of Product Cards */}
      {filteredItems.length === 0 ? (
        <div
          style={{
            padding: '64px 24px',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--color-border)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
            No matching items found
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            Try adjusting your search query or reset your category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory(null);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--color-accent)',
              color: '#ffffff',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onQuickAdd={onQuickAdd}
              isItemInCart={cartItemIds.has(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
