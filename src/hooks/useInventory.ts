import { useState, useEffect } from 'react';
import { 
  InventoryItem, 
  StockMovement, 
  LowStockAlert, 
  Supplier,
  PurchaseOrder,
  WasteRecord,
  InventoryAnalytics,
  MovementType,
  InventoryCategory,
  InventoryUnit,
  AlertUrgency,
  WasteReason
} from '../types/inventory';
import toast from 'react-hot-toast';

const INVENTORY_STORAGE_KEY = 'urdhero-inventory-data';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      // Simulate API loading
      await new Promise(resolve => setTimeout(resolve, 800));

      // Load from localStorage or generate mock data
      const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setItems(data.items || []);
        setMovements(data.movements || []);
        setSuppliers(data.suppliers || []);
        setWasteRecords(data.wasteRecords || []);
      } else {
        // Initialize with comprehensive mock data
        initializeMockData();
      }

      // Generate alerts and analytics
      generateLowStockAlerts();
      generateAnalytics();
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Gabim në ngarkimin e inventarit');
    } finally {
      setLoading(false);
    }
  };

  const initializeMockData = () => {
    const mockItems: InventoryItem[] = [
      {
        id: 'inv_001',
        name: 'Tomatoes',
        nameAlbanian: 'Domate',
        category: InventoryCategory.VEGETABLES,
        unit: InventoryUnit.KG,
        currentStock: 8.5,
        minimumStock: 15,
        maximumStock: 50,
        costPerUnit: 180, // €1.80/kg
        sellPricePerUnit: 300,
        supplierId: 'sup_001',
        supplierName: 'Fresh Produce Albania',
        lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: 'Refrigerator A2',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'inv_002', 
        name: 'Mozzarella Cheese',
        nameAlbanian: 'Djathë Mozzarella',
        category: InventoryCategory.DAIRY,
        unit: InventoryUnit.KG,
        currentStock: 3.2,
        minimumStock: 5,
        maximumStock: 20,
        costPerUnit: 850, // €8.50/kg
        sellPricePerUnit: 1200,
        supplierId: 'sup_002',
        supplierName: 'Dairy Fresh Co.',
        lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Refrigerator B1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'inv_003',
        name: 'Aperol',
        nameAlbanian: 'Aperol',
        category: InventoryCategory.BEVERAGES,
        unit: InventoryUnit.BOTTLE,
        currentStock: 2,
        minimumStock: 3,
        maximumStock: 12,
        costPerUnit: 1800, // €18.00/bottle
        sellPricePerUnit: 850, // €8.50 per drink
        supplierId: 'sup_003',
        supplierName: 'Premium Spirits Ltd',
        lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        location: 'Bar Storage',
        barcode: '123456789',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'inv_004',
        name: 'Fresh Fish',
        nameAlbanian: 'Peshk i Freskët',
        category: InventoryCategory.SEAFOOD,
        unit: InventoryUnit.KG,
        currentStock: 12.5,
        minimumStock: 8,
        maximumStock: 25,
        costPerUnit: 1200, // €12.00/kg
        sellPricePerUnit: 1800,
        supplierId: 'sup_004',
        supplierName: 'Adriatic Seafood',
        lastRestocked: new Date(),
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        location: 'Freezer C1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'inv_005',
        name: 'Olive Oil',
        nameAlbanian: 'Vaj Ulliri',
        category: InventoryCategory.SPICES,
        unit: InventoryUnit.LITER,
        currentStock: 4.2,
        minimumStock: 3,
        maximumStock: 15,
        costPerUnit: 800, // €8.00/liter
        supplierId: 'sup_001',
        supplierName: 'Fresh Produce Albania',
        lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        location: 'Pantry A1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const mockSuppliers: Supplier[] = [
      {
        id: 'sup_001',
        name: 'Fresh Produce Albania',
        contactName: 'Agron Doci',
        email: 'agron@freshproduce.al',
        phone: '+355 69 123 4567',
        address: 'Rruga e Kavajës 156, Tiranë',
        categories: [InventoryCategory.VEGETABLES, InventoryCategory.SPICES],
        isActive: true,
        rating: 4.8,
        paymentTerms: '30 ditë',
        deliveryTime: 1,
        minimumOrder: 5000, // €50
        createdAt: new Date()
      },
      {
        id: 'sup_002',
        name: 'Dairy Fresh Co.',
        contactName: 'Marjeta Koci',
        email: 'marjeta@dairyfresh.al',
        phone: '+355 69 234 5678',
        address: 'Zona Industriale, Durrës',
        categories: [InventoryCategory.DAIRY],
        isActive: true,
        rating: 4.9,
        paymentTerms: '15 ditë',
        deliveryTime: 2,
        minimumOrder: 3000, // €30
        createdAt: new Date()
      },
      {
        id: 'sup_003',
        name: 'Premium Spirits Ltd',
        contactName: 'Gentian Hoxha',
        email: 'gentian@premiumspirits.al',
        phone: '+355 69 345 6789',
        address: 'Rruga Wilson, Tiranë',
        categories: [InventoryCategory.BEVERAGES],
        isActive: true,
        rating: 4.7,
        paymentTerms: '45 ditë',
        deliveryTime: 3,
        minimumOrder: 10000, // €100
        createdAt: new Date()
      },
      {
        id: 'sup_004',
        name: 'Adriatic Seafood',
        contactName: 'Bledar Frroku',
        email: 'bledar@adriaticseafood.al',
        phone: '+355 69 456 7890',
        address: 'Porti Durrës, Durrës',
        categories: [InventoryCategory.SEAFOOD],
        isActive: true,
        rating: 4.6,
        paymentTerms: '7 ditë',
        deliveryTime: 1,
        minimumOrder: 2000, // €20
        createdAt: new Date()
      }
    ];

    const mockMovements: StockMovement[] = [
      {
        id: 'mov_001',
        itemId: 'inv_001',
        itemName: 'Domate',
        type: MovementType.STOCK_OUT,
        quantity: 2.5,
        unit: InventoryUnit.KG,
        reason: 'Përdorim për porosi #UR-156',
        referenceId: 'UR-156',
        userId: 'chef_001',
        userName: 'Marko Kuzhina',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'mov_002',
        itemId: 'inv_002',
        itemName: 'Djathë Mozzarella',
        type: MovementType.STOCK_IN,
        quantity: 5,
        unit: InventoryUnit.KG,
        costPerUnit: 850,
        totalCost: 4250,
        reason: 'Furnizim i rregullt',
        supplierId: 'sup_002',
        userId: 'manager_001',
        userName: 'Ana Menaxhere',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'mov_003',
        itemId: 'inv_001',
        itemName: 'Domate',
        type: MovementType.WASTE,
        quantity: 1.2,
        unit: InventoryUnit.KG,
        reason: 'Të prishura',
        userId: 'chef_001',
        userName: 'Marko Kuzhina',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];

    const mockWasteRecords: WasteRecord[] = [
      {
        id: 'waste_001',
        itemId: 'inv_001',
        itemName: 'Domate',
        quantity: 1.2,
        unit: InventoryUnit.KG,
        reason: WasteReason.SPOILED,
        costValue: 216, // 1.2 * 180
        reportedBy: 'chef_001',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        notes: 'Të prishura për shkak të temperaturës së lartë'
      },
      {
        id: 'waste_002',
        itemId: 'inv_004',
        itemName: 'Peshk i Freskët',
        quantity: 0.8,
        unit: InventoryUnit.KG,
        reason: WasteReason.EXPIRED,
        costValue: 960, // 0.8 * 1200
        reportedBy: 'chef_002',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: 'Skadim afati'
      }
    ];

    setItems(mockItems);
    setMovements(mockMovements);
    setSuppliers(mockSuppliers);
    setWasteRecords(mockWasteRecords);

    saveToStorage({
      items: mockItems,
      movements: mockMovements,
      suppliers: mockSuppliers,
      wasteRecords: mockWasteRecords
    });
  };

  const generateLowStockAlerts = () => {
    const lowStockItems = items.filter(item => item.currentStock <= item.minimumStock);
    
    const alerts: LowStockAlert[] = lowStockItems.map(item => {
      const urgency = item.currentStock <= item.minimumStock * 0.5 
        ? AlertUrgency.CRITICAL
        : item.currentStock <= item.minimumStock * 0.7
          ? AlertUrgency.HIGH
          : AlertUrgency.MEDIUM;

      // Estimate stockout date based on usage
      const dailyUsage = calculateDailyUsage(item.id);
      const daysUntilStockout = dailyUsage > 0 ? item.currentStock / dailyUsage : 999;
      const estimatedStockoutDate = new Date(Date.now() + daysUntilStockout * 24 * 60 * 60 * 1000);

      const suggestedOrderQuantity = Math.max(
        item.maximumStock - item.currentStock,
        item.minimumStock * 2
      );

      return {
        id: `alert_${item.id}`,
        itemId: item.id,
        itemName: item.nameAlbanian,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        category: item.category,
        urgency,
        estimatedStockoutDate,
        suggestedOrderQuantity,
        createdAt: new Date(),
        isResolved: false
      };
    });

    setAlerts(alerts);
  };

  const calculateDailyUsage = (itemId: string): number => {
    const recentMovements = movements.filter(
      m => m.itemId === itemId && 
           m.type === MovementType.STOCK_OUT &&
           m.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    );

    const totalUsage = recentMovements.reduce((sum, m) => sum + m.quantity, 0);
    return totalUsage / 7; // Daily average
  };

  const generateAnalytics = () => {
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.currentStock <= item.minimumStock).length;
    
    const wasteValue = wasteRecords.reduce((sum, record) => sum + record.costValue, 0);
    const wastePercentage = totalValue > 0 ? (wasteValue / totalValue) * 100 : 0;

    const topWastedItems = wasteRecords
      .reduce((acc, record) => {
        const existing = acc.find(item => item.itemId === record.itemId);
        if (existing) {
          existing.wasteQuantity += record.quantity;
          existing.wasteValue += record.costValue;
        } else {
          acc.push({
            itemId: record.itemId,
            itemName: record.itemName,
            wasteQuantity: record.quantity,
            wasteValue: record.costValue
          });
        }
        return acc;
      }, [] as any[])
      .sort((a, b) => b.wasteValue - a.wasteValue)
      .slice(0, 5);

    const categoryBreakdown = Object.values(InventoryCategory).map(category => {
      const categoryItems = items.filter(item => item.category === category);
      return {
        category,
        itemCount: categoryItems.length,
        totalValue: categoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0),
        lowStockCount: categoryItems.filter(item => item.currentStock <= item.minimumStock).length
      };
    }).filter(cat => cat.itemCount > 0);

    const analytics: InventoryAnalytics = {
      totalValue,
      totalItems,
      lowStockItems,
      wasteValue,
      wastePercentage,
      topWastedItems,
      stockTurnover: 4.2, // Mock calculation
      categoryBreakdown,
      costTrends: [] // Would be generated from historical data
    };

    setAnalytics(analytics);
  };

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `mov_${Date.now()}`,
      createdAt: new Date()
    };

    setMovements(prev => [newMovement, ...prev]);
    
    // Update item stock
    if (movement.type === MovementType.STOCK_IN) {
      updateItemStock(movement.itemId, movement.quantity, 'add');
      toast.success(`✅ +${movement.quantity} ${movement.unit} ${movement.itemName}`);
    } else if (movement.type === MovementType.STOCK_OUT || movement.type === MovementType.WASTE) {
      updateItemStock(movement.itemId, movement.quantity, 'subtract');
      toast.success(`📤 -${movement.quantity} ${movement.unit} ${movement.itemName}`);
    }

    saveToStorage({ movements: [newMovement, ...movements] });
  };

  const updateItemStock = (itemId: string, quantity: number, operation: 'add' | 'subtract') => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = operation === 'add' 
          ? item.currentStock + quantity
          : item.currentStock - quantity;
        
        return {
          ...item,
          currentStock: Math.max(0, newStock),
          updatedAt: new Date()
        };
      }
      return item;
    }));
  };

  const addWasteRecord = (waste: Omit<WasteRecord, 'id' | 'createdAt'>) => {
    const newWaste: WasteRecord = {
      ...waste,
      id: `waste_${Date.now()}`,
      createdAt: new Date()
    };

    setWasteRecords(prev => [newWaste, ...prev]);
    
    // Also create stock movement
    addStockMovement({
      itemId: waste.itemId,
      itemName: waste.itemName,
      type: MovementType.WASTE,
      quantity: waste.quantity,
      unit: waste.unit,
      reason: `Humbje: ${waste.reason}`,
      userId: waste.reportedBy,
      userName: 'Staff Member'
    });

    toast.error(`🗑️ Humbje: ${waste.quantity} ${waste.unit} ${waste.itemName}`, {
      duration: 4000
    });
  };

  const updateItem = (itemId: string, updates: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    ));
    
    toast.success('Artikulli u përditësua me sukses');
  };

  const saveToStorage = (data: any) => {
    const currentData = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY) || '{}');
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedData));
  };

  const formatCurrency = (cents: number) => `€${(cents / 100).toFixed(2)}`;

  const getCategoryItems = (category: InventoryCategory) => 
    items.filter(item => item.category === category);

  const getExpiringItems = (days: number = 3) => 
    items.filter(item => 
      item.expiryDate && 
      item.expiryDate <= new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    );

  const getLowStockItemsCount = () => 
    items.filter(item => item.currentStock <= item.minimumStock).length;

  const getCriticalAlerts = () => 
    alerts.filter(alert => alert.urgency === AlertUrgency.CRITICAL);

  return {
    items,
    movements,
    alerts,
    suppliers,
    purchaseOrders,
    wasteRecords,
    analytics,
    loading,
    addStockMovement,
    addWasteRecord,
    updateItem,
    formatCurrency,
    getCategoryItems,
    getExpiringItems,
    getLowStockItemsCount,
    getCriticalAlerts,
    refresh: loadInventoryData
  };
};