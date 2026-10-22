# Aura Event Rentals — Multi-Vendor Marketplace Website

This folder contains the complete frontend web application for Aura Event Rentals.

## 🚀 Quick Start

From this directory (`website/`):

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📂 Architecture & Directory Structure

- `src/`
  - `components/`
    - `customer/` — Hero section, Category rail, Bundles, Multi-vendor cart drawer, Checkout modal, Orders modal, Product grid/card/modal
    - `vendor/` — Vendor dashboard (manifests, order approval, catalog management)
    - `admin/` — Admin portal (platform health, vendor verification, revenue metrics)
    - `developer/` — Developer control room (system audit logs, simulation tools)
    - `navigation/` — Global Navbar and search
    - `common/` — Role switcher banner, Toast notifications, Date picker modal
  - `context/` — `MarketplaceContext.tsx` providing multi-role state, orders, vendors, items
  - `data/` — Seed data and marketplace inventory
  - `services/` — Availability engine, Cart engine, Order engine, Developer audit engine
  - `types/` — TypeScript interfaces for marketplace schemas
  - `index.css` — Global styling and design tokens
  - `App.tsx` & `main.tsx` — Root application components
- `index.html` — HTML shell with Google Fonts & responsive viewport
- `vite.config.ts` — Vite build configuration
- `tsconfig.json` — TypeScript configuration
