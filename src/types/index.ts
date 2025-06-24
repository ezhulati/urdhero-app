import { Timestamp } from 'firebase/firestore';

// Enums
export enum OrderStatus {
  E_RE = 'e_re',
  PRANUAR = 'pranuar',
  DUKE_U_PERGATITUR = 'duke_u_pergatitur',
  GATI = 'gati',
  SHERBYER = 'sherbyer',
  ANULUAR = 'anuluar'
}

export enum PaymentMethod {
  KESH = 'kesh',
  KARTE = 'karte',
  DIGITAL = 'digital'
}

export enum UserRole {
  ADMIN = 'admin',
  MENAXHER = 'menaxher',
  KAMARIER = 'kamarier',
  KUZHINIER = 'kuzhinier',
  BARTENDER = 'bartender'
}

export enum VenueType {
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  CAFE = 'cafe',
  HOTEL = 'hotel',
  EVENT_VENUE = 'event_venue',
  NIGHT_CLUB = 'night_club',
  FAST_FOOD = 'fast_food',
  FOOD_TRUCK = 'food_truck',
  BAKERY = 'bakery',
  BREWERY = 'brewery',
  WINERY = 'winery',
  LOUNGE = 'lounge',
  BEACH_BAR = 'beach_bar',
  ROOFTOP = 'rooftop'
}

export enum MenuCategory {
  PIJE = 'Pije',
  USHQIM = 'Ushqim',
  EMBELSIRA = 'Ëmbëlsira',
  APERITIVET = 'Aperitivet',
  SALLATAT = 'Sallatat',
  PIZZA = 'Pizza',
  PASTA = 'Pasta',
  PESHK = 'Peshk',
  MISH = 'Mish',
  VEGETARIANE = 'Vegetariane',
  KOKTEJE = 'Kokteje',
  VERE = 'Verë',
  BIRRA = 'Birrë',
  KAFE = 'Kafë',
  BREAKFAST = 'Mëngjes',
  SNACKS = 'Snacks',
  DESSERTS = 'Ëmbëlsira'
}

// Database Models - Updated Restaurant to Venue
export interface Venue {
  id: string;
  emri: string;
  slug: string;
  venueType: VenueType;
  email: string;
  telefoni?: string;
  adresa?: string;
  pershkrimi?: string;
  orariPunes?: {
    hapeNe: string;
    mbyllNe: string;
    ditetJaves: string[];
  };
  paymentSettings?: {
    acceptsKesh: boolean;
    acceptsKarte: boolean;
    acceptsDigital: boolean;
    defaultMethod?: PaymentMethod;
    minimumOrderForCard?: number; // Minimum order amount for card payments (in cents)
    cardProcessingFee?: number; // Fee percentage for card payments
  };
  features?: {
    hasSeating: boolean;
    hasDelivery: boolean;
    hasTakeaway: boolean;
    hasWifi: boolean;
    hasParking: boolean;
    isOutdoor?: boolean;
    hasLiveMusic?: boolean;
    hasEvents?: boolean;
  };
  eshteAktiv: boolean;
  krijuarNe: Timestamp | Date;
  perditesuesNe: Timestamp | Date;
}

// Keep Restaurant as alias for backward compatibility
export interface Restaurant extends Venue {}

export interface Table {
  id: string;
  kodi: string;
  emriPerShfaqje: string;
  pershkrimi?: string;
  pozicioni?: {
    x: number;
    y: number;
    zona: string;
  };
  qrCodeUrl?: string;
  eshteAktive: boolean;
  krijuarNe: Timestamp | Date;
}

export interface MenuItem {
  id: string;
  emri: string;
  pershkrimi: string;
  cmimi: number; // Price in lekë (850 = 8.50 EUR)
  kategoria: string;
  nenkategoria?: string;
  imazhi?: string;
  allergenat?: string[];
  eshteVegan?: boolean;
  eshteVegetarian?: boolean;
  eshteIGatshem: boolean;
  kohaPergatitjes?: number;
  rradhaRenditjes: number;
  krijuarNe: Timestamp | Date;
  perditesuesNe: Timestamp | Date;
}

export interface OrderItem {
  menuItemId: string;
  emriArtikulli: string;
  sasia: number;
  cmimiNjesi: number;
  cmimiTotal: number;
  instruksioneSpeciale?: string;
}

export interface Order {
  id: string;
  numriPorosise: string;
  venueId: string; // Changed from restorantiId
  tavolinaId: string;
  emriTavolines: string;
  klienti?: {
    emri: string;
    telefoni: string;
    email: string;
  };
  artikujt: OrderItem[];
  instruksioneSpeciale?: string;
  shumaTotale: number;
  statusi: OrderStatus;
  krijuarNe: Timestamp | Date;
  pranusNe?: Timestamp | Date;
  duke_u_pergatitNe?: Timestamp | Date;
  gatiNe?: Timestamp | Date;
  sherbyeNe?: Timestamp | Date;
  anuluarNe?: Timestamp | Date;
  metodaPageses: PaymentMethod;
  eshtePagetuar: boolean;
  burimiPorosise: string;
  versioni: number;
}

export interface User {
  id: string;
  email: string;
  emri: string;
  mbiemri: string;
  venueId: string; // Changed from restorantiId
  roli: UserRole;
  telefonKontakti?: string;
  eshteAktiv: boolean;
  qasjaEFundit?: Timestamp | Date;
  krijuarNe: Timestamp | Date;
  perditesuesNe: Timestamp | Date;
}

// Cart Item for frontend state
export interface CartItem extends OrderItem {
  menuItem: MenuItem;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VenueMenuResponse {
  venue: Venue;
  table?: Table;
  categories: Record<string, MenuItem[]>;
}

// Keep RestaurantMenuResponse as alias for backward compatibility
export interface RestaurantMenuResponse extends VenueMenuResponse {}

export interface OrderResponse {
  numriPorosise: string;
  orderId: string;
  shumaTotale: number;
  kohaVleresimuarPergatitjes: number;
}

// Venue type configurations
export const VENUE_CONFIGS = {
  [VenueType.RESTAURANT]: {
    name: 'Restorant',
    nameEn: 'Restaurant',
    icon: '🍽️',
    color: '#e11d48',
    description: 'Restorante tradicionale dhe moderne',
    features: ['hasSeating', 'hasDelivery', 'hasTakeaway'],
    categories: [MenuCategory.USHQIM, MenuCategory.PIJE, MenuCategory.EMBELSIRA, MenuCategory.SALLATAT]
  },
  [VenueType.BAR]: {
    name: 'Bar',
    nameEn: 'Bar',
    icon: '🍺',
    color: '#f59e0b',
    description: 'Bare dhe pub për pije dhe snacks',
    features: ['hasSeating', 'hasLiveMusic'],
    categories: [MenuCategory.PIJE, MenuCategory.KOKTEJE, MenuCategory.BIRRA, MenuCategory.SNACKS]
  },
  [VenueType.CAFE]: {
    name: 'Kafe',
    nameEn: 'Café',
    icon: '☕',
    color: '#8b5cf6',
    description: 'Kafene dhe coffee shops',
    features: ['hasSeating', 'hasTakeaway', 'hasWifi'],
    categories: [MenuCategory.KAFE, MenuCategory.EMBELSIRA, MenuCategory.BREAKFAST, MenuCategory.SNACKS]
  },
  [VenueType.HOTEL]: {
    name: 'Hotel',
    nameEn: 'Hotel',
    icon: '🏨',
    color: '#0ea5e9',
    description: 'Hotele dhe room service',
    features: ['hasSeating', 'hasDelivery', 'hasParking'],
    categories: [MenuCategory.USHQIM, MenuCategory.PIJE, MenuCategory.BREAKFAST, MenuCategory.EMBELSIRA]
  },
  [VenueType.EVENT_VENUE]: {
    name: 'Vend Eventi',
    nameEn: 'Event Venue',
    icon: '🎉',
    color: '#ec4899',
    description: 'Salla eventesh dhe dasma',
    features: ['hasSeating', 'hasEvents', 'hasParking'],
    categories: [MenuCategory.USHQIM, MenuCategory.PIJE, MenuCategory.KOKTEJE, MenuCategory.EMBELSIRA]
  },
  [VenueType.NIGHT_CLUB]: {
    name: 'Klub Nate',
    nameEn: 'Night Club',
    icon: '🌙',
    color: '#6366f1',
    description: 'Klube nate dhe diskoteka',
    features: ['hasLiveMusic', 'hasEvents'],
    categories: [MenuCategory.PIJE, MenuCategory.KOKTEJE, MenuCategory.BIRRA]
  },
  [VenueType.FAST_FOOD]: {
    name: 'Fast Food',
    nameEn: 'Fast Food',
    icon: '🍔',
    color: '#dc2626',
    description: 'Ushqim i shpejtë dhe casual dining',
    features: ['hasTakeaway', 'hasDelivery'],
    categories: [MenuCategory.USHQIM, MenuCategory.SNACKS, MenuCategory.PIJE]
  },
  [VenueType.FOOD_TRUCK]: {
    name: 'Food Truck',
    nameEn: 'Food Truck',
    icon: '🚚',
    color: '#059669',
    description: 'Kamiona ushqimi dhe street food',
    features: ['hasTakeaway'],
    categories: [MenuCategory.USHQIM, MenuCategory.SNACKS, MenuCategory.PIJE]
  },
  [VenueType.BAKERY]: {
    name: 'Furre',
    nameEn: 'Bakery',
    icon: '🥖',
    color: '#d97706',
    description: 'Furra dhe pastiçeri',
    features: ['hasTakeaway', 'hasSeating'],
    categories: [MenuCategory.EMBELSIRA, MenuCategory.BREAKFAST, MenuCategory.KAFE]
  },
  [VenueType.BREWERY]: {
    name: 'Fabrikë Birre',
    nameEn: 'Brewery',
    icon: '🍻',
    color: '#7c2d12',
    description: 'Fabrika birrash dhe brewpub',
    features: ['hasSeating', 'hasLiveMusic'],
    categories: [MenuCategory.BIRRA, MenuCategory.SNACKS, MenuCategory.USHQIM]
  },
  [VenueType.WINERY]: {
    name: 'Kantinë Vere',
    nameEn: 'Winery',
    icon: '🍷',
    color: '#7e22ce',
    description: 'Kantina vere dhe wine bar',
    features: ['hasSeating', 'isOutdoor'],
    categories: [MenuCategory.VERE, MenuCategory.USHQIM, MenuCategory.EMBELSIRA]
  },
  [VenueType.LOUNGE]: {
    name: 'Lounge',
    nameEn: 'Lounge',
    icon: '🛋️',
    color: '#1f2937',
    description: 'Lounge dhe cocktail bar',
    features: ['hasSeating', 'hasLiveMusic'],
    categories: [MenuCategory.KOKTEJE, MenuCategory.PIJE, MenuCategory.SNACKS]
  },
  [VenueType.BEACH_BAR]: {
    name: 'Beach Bar',
    nameEn: 'Beach Bar',
    icon: '🏖️',
    color: '#0891b2',
    description: 'Bare në plazh dhe resort',
    features: ['hasSeating', 'isOutdoor'],
    categories: [MenuCategory.PIJE, MenuCategory.KOKTEJE, MenuCategory.SNACKS, MenuCategory.USHQIM]
  },
  [VenueType.ROOFTOP]: {
    name: 'Rooftop',
    nameEn: 'Rooftop',
    icon: '🏙️',
    color: '#4338ca',
    description: 'Bar dhe restorant në çati',
    features: ['hasSeating', 'isOutdoor'],
    categories: [MenuCategory.KOKTEJE, MenuCategory.PIJE, MenuCategory.USHQIM, MenuCategory.EMBELSIRA]
  }
};