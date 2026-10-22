import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  onExploreClick: () => void;
}

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    title: 'HEIRLOOM WEDDING PROPS',
    subtitle: 'Grand entrances, crystal chandeliers & regal brass urns for memorable occasions.',
    tag: 'CURATED LUXURY',
  },
  {
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    title: 'STATEMENT TABLES & SEATING',
    subtitle: 'Intricately carved consoles and luxury chairs that elevate guest dining.',
    tag: 'HANDCRAFTED FINISHES',
  },
  {
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=85',
    title: 'ATMOSPHERIC CANDLELIGHT',
    subtitle: 'Gilded candelabras and pierced lanterns creating enchanting evening celebrations.',
    tag: 'EVENT DESIGN',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExploreClick }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      style={{
        position: 'relative',
        height: '75vh',
        minHeight: '520px',
        overflow: 'hidden',
        backgroundColor: '#111827',
      }}
    >
      {slides.map((slide, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: idx === current ? 'auto' : 'none',
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: idx === current ? 'scale(1.02)' : 'scale(1.08)',
              transition: 'transform 6s ease-out',
            }}
          />
          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              bottom: '64px',
              left: '0',
              right: '0',
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 32px',
              color: '#ffffff',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '16px',
              }}
            >
              {slide.tag}
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                lineHeight: 0.95,
                fontWeight: 700,
                letterSpacing: '0.02em',
                marginBottom: '14px',
                textTransform: 'uppercase',
                maxWidth: '850px',
              }}
            >
              {slide.title}
            </h2>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.88)',
                maxWidth: '560px',
                marginBottom: '28px',
                lineHeight: 1.5,
              }}
            >
              {slide.subtitle}
            </p>
            <button
              onClick={onExploreClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                borderRadius: 'var(--radius-pill)',
                fontSize: '15px',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                transition: 'transform 0.15s ease, background-color 0.2s ease',
              }}
            >
              <span>Explore Rental Catalog</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              width: idx === current ? '28px' : '8px',
              height: '8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: idx === current ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.4)',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
