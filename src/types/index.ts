export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  whatsapp_number: string;
  currency: string;
  theme_color: string;
  brand_primary_hsl: string;
  brand_secondary_hsl: string;
  instagram_url?: string;
  google_maps_url?: string;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  cover_image_url: string;
  item_count: number;
}

export interface InventoryItem {
  id: string;
  tenant_id: string;
  category_id: string;
  category_name: string;
  name: string;
  description: string;
  sku: string;
  rental_price: number; // in INR
  show_price_on_storefront: boolean;
  dimension: string;
  item_type: 'non-consumable' | 'consumable';
  total_qty: number;
  available_qty: number | null;
  primary_image_url: string;
  image_urls: string[];
  tags: string[];
}

export interface CartItem {
  item: InventoryItem;
  quantity: number;
}

export interface BookingDates {
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null;   // YYYY-MM-DD
  durationDays: number;
}

export interface QuoteInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  eventDates: string;
  durationDays: number;
  items: { name: string; sku: string; qty: number; unitPrice: number; lineTotal: number }[];
  totalEstimate: number;
  status: 'sent' | 'confirmed';
  createdAt: string;
}
