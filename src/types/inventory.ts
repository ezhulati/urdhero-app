export interface InventoryItem {
  id: string;
  name: string;
  nameAlbanian: string;
  category: InventoryCategory;
  unit: InventoryUnit;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  costPerUnit: number; // in cents
  sellPricePerUnit?: number; // in cents
  supplierId?: string;
  supplierName?: string;
  lastRestocked: Date;
  expiryDate?: Date;
  location: string; // storage location
  barcode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum InventoryCategory {
  VEGETABLES = 'vegetables',
  MEAT = 'meat', 
  DAIRY = 'dairy',
  SEAFOOD = 'seafood',
  GRAINS = 'grains',
  BEVERAGES = 'beverages',
  SPICES = 'spices',
  FROZEN = 'frozen',
  CLEANING = 'cleaning',
  PACKAGING = 'packaging'
}

export enum InventoryUnit {
  KG = 'kg',
  LITER = 'liter',
  PIECE = 'piece',
  PACKAGE = 'package',
  BOTTLE = 'bottle',
  CAN = 'can',
  BOX = 'box'
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: MovementType;
  quantity: number;
  unit: InventoryUnit;
  costPerUnit?: number;
  totalCost?: number;
  reason: string;
  referenceId?: string; // order ID, waste record ID, etc.
  supplierId?: string;
  userId: string;
  userName: string;
  createdAt: Date;
  expiryDate?: Date;
}

export enum MovementType {
  STOCK_IN = 'stock_in',
  STOCK_OUT = 'stock_out', 
  WASTE = 'waste',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer'
}

export interface LowStockAlert {
  id: string;
  itemId: string;
  itemName: string;
  currentStock: number;
  minimumStock: number;
  category: InventoryCategory;
  urgency: AlertUrgency;
  estimatedStockoutDate: Date;
  suggestedOrderQuantity: number;
  createdAt: Date;
  isResolved: boolean;
  resolvedAt?: Date;
}

export enum AlertUrgency {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  categories: InventoryCategory[];
  isActive: boolean;
  rating: number;
  paymentTerms: string;
  deliveryTime: number; // days
  minimumOrder?: number;
  createdAt: Date;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalCost: number;
  deliveryDate?: Date;
  receivedDate?: Date;
  createdBy: string;
  createdAt: Date;
  notes?: string;
}

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantityOrdered: number;
  quantityReceived?: number;
  costPerUnit: number;
  totalCost: number;
  unit: InventoryUnit;
}

export interface DemandForecast {
  itemId: string;
  itemName: string;
  period: 'daily' | 'weekly' | 'monthly';
  forecastQuantity: number;
  confidence: number; // 0-100
  factors: ForecastFactor[];
  generatedAt: Date;
}

export interface ForecastFactor {
  type: 'seasonal' | 'trend' | 'event' | 'historical';
  impact: number; // -100 to 100
  description: string;
}

export interface WasteRecord {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: InventoryUnit;
  reason: WasteReason;
  costValue: number;
  reportedBy: string;
  createdAt: Date;
  notes?: string;
}

export enum WasteReason {
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
  SPOILED = 'spoiled',
  OVERCOOKED = 'overcooked',
  CUSTOMER_RETURN = 'customer_return',
  SPILLED = 'spilled',
  OTHER = 'other'
}

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  wasteValue: number;
  wastePercentage: number;
  topWastedItems: Array<{
    itemId: string;
    itemName: string;
    wasteQuantity: number;
    wasteValue: number;
  }>;
  stockTurnover: number;
  categoryBreakdown: Array<{
    category: InventoryCategory;
    itemCount: number;
    totalValue: number;
    lowStockCount: number;
  }>;
  costTrends: Array<{
    date: string;
    totalCost: number;
    wasteValue: number;
  }>;
}