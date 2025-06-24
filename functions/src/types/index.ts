// Types for Firebase Cloud Functions

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
  MANAGER = 'manager',
  STAFF = 'staff'
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

export interface Venue {
  id?: string;
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
  status?: 'pending_approval' | 'active' | 'suspended';
  paymentSettings?: {
    acceptsKesh: boolean;
    acceptsKarte: boolean;
    acceptsDigital: boolean;
    defaultMethod?: PaymentMethod;
    minimumOrderForCard?: number;
    cardProcessingFee?: number;
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
  krijuarNe: any; // Firestore timestamp
  perditesuesNe: any; // Firestore timestamp
}

export interface Table {
  id?: string;
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
  krijuarNe: any; // Firestore timestamp
  perditesuesNe?: any; // Firestore timestamp
}

export interface MenuItem {
  id?: string;
  emri: string;
  pershkrimi: string;
  cmimi: number;
  kategoria: string;
  nenkategoria?: string;
  imazhi?: string;
  allergenat?: string[];
  eshteVegan?: boolean;
  eshteVegetarian?: boolean;
  eshteIGatshem: boolean;
  kohaPergatitjes?: number;
  rradhaRenditjes: number;
  krijuarNe: any; // Firestore timestamp
  perditesuesNe: any; // Firestore timestamp
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
  id?: string;
  numriPorosise: string;
  restorantiId: string;
  tavolinaId: string;
  emriTavolines: string;
  klienti?: {
    emri?: string;
    telefoni?: string;
    email?: string;
  };
  artikujt: OrderItem[];
  instruksioneSpeciale?: string;
  shumaTotale: number;
  statusi: OrderStatus;
  krijuarNe: any; // Firestore timestamp
  pranusNe?: any; // Firestore timestamp
  duke_u_pergatitNe?: any; // Firestore timestamp
  gatiNe?: any; // Firestore timestamp
  sherbyeNe?: any; // Firestore timestamp
  anuluarNe?: any; // Firestore timestamp
  arsyejaAnulimit?: string;
  metodaPageses: PaymentMethod;
  eshtePagetuar: boolean;
  burimiPorosise: string;
  versioni: number;
}

// Request/response types for functions
export interface RegisterVenueRequest {
  name: string;
  type: VenueType;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface RegisterVenueResponse {
  venueId: string;
  slug: string;
  adminUserId: string;
}

export interface CreateOrderRequest {
  venueId: string;
  tableId: string;
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  estimatedPreparationTime: number;
  trackingUrl: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
  cancellationReason?: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  newStatus: OrderStatus;
}

export interface GetOrderByNumberRequest {
  orderNumber: string;
}

export interface GetOrderByNumberResponse {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  timestamps: {
    created: string | null;
    accepted: string | null;
    preparing: string | null;
    ready: string | null;
    served: string | null;
    cancelled: string | null;
  };
  venueInfo: {
    id: string;
    name: string;
    slug: string;
    type: string;
  };
  tableInfo: {
    id: string;
    name: string;
    description?: string;
    zone?: string;
  };
}