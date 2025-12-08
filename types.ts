export type UserRole = 'resident' | 'provider';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  user_type: UserRole;
  bio?: string;
  address?: string;
  condo_name?: string;
  birth_date?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  // Provider specific
  document?: string;
  provider_type?: 'service' | 'product';
  categories?: string[];
  rating?: number;
}

export interface AppSettings {
  id: number;
  logo_url: string;
}

export interface Service {
  id: string;
  provider_id: string;
  category_id?: string;
  title: string;
  description?: string;
  price: number;
  duration_minutes?: number;
  image_url?: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  images?: string[];
  is_available: boolean;
  location?: string;
  product_type?: 'store' | 'desapego';
  contact_phone?: string;
  created_at?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'service' | 'product';
  imageUrl?: string;
  isAvailableForOrder?: boolean;
}

export interface ProviderProfile extends Profile {
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  offers?: Offer[];
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customer_id: string;
  provider_id: string;
  status: OrderStatus;
  total_amount: number;
  payment_method: string;
  delivery_address: string;
  created_at: string;
  items?: OrderItem[];
  clientName?: string; // For UI display
  clientAddress?: string; // For UI display
  date?: string; // For UI display
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  title?: string; // For UI display
}

export interface CartItem {
  offerId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  providerId: string;
  type: 'service' | 'product';
}

export interface Booking {
  id: string;
  service_id: string;
  provider_id: string;
  customer_id: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  total_price: number;
  created_at: string;
  service?: Service;
  provider?: Profile;
  customer?: Profile;
}

export interface RegistrationState {
  step: number;
  role: UserRole | null;
  basicInfo: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    birthDate: string;
    condoName?: string;
    address?: string;
  };
  residentInfo: {
    condo: string;
    block: string;
    unit: string;
  };
  providerInfo: {
    document: string;
    type: 'service' | 'product' | null;
    categories: string[];
    bio: string;
  };
}


export const CATEGORIES_SERVICE = [
  { id: 'limpeza', name: 'Limpeza', icon: '🧹' },
  { id: 'manutencao', name: 'Manutenção', icon: '🔧' },
  { id: 'beleza', name: 'Beleza', icon: '💅' },
  { id: 'aulas', name: 'Aulas', icon: '📚' },
  { id: 'pets', name: 'Pets', icon: '🐾' },
  { id: 'outros', name: 'Outros', icon: '✨' }
];

export const CATEGORIES_PRODUCT = [
  { id: 'comida', name: 'Comida Caseira', icon: '🍲' },
  { id: 'doces', name: 'Doces e Bolos', icon: '🍰' },
  { id: 'artesanato', name: 'Artesanato', icon: '🎨' },
  { id: 'congelados', name: 'Congelados', icon: '❄️' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'outros', name: 'Outros', icon: '✨' }
];

// Aliases for backward compatibility if needed
export const SERVICE_CATEGORIES = CATEGORIES_SERVICE;
export const PRODUCT_CATEGORIES = CATEGORIES_PRODUCT;