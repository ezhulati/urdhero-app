import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../hooks/useCart';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    store
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());
    
    const mockItem = {
      id: '1',
      emri: 'Test Item',
      pershkrimi: 'Test Description',
      cmimi: 1000,
      kategoria: 'Test Category',
      eshteIGatshem: true,
      rradhaRenditjes: 1,
      krijuarNe: new Date(),
      perditesuesNe: new Date()
    };
    
    act(() => {
      result.current.addItem(mockItem, 2);
    });
    
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].sasia).toBe(2);
    expect(result.current.items[0].cmimiTotal).toBe(2000);
    expect(result.current.getTotalItems()).toBe(2);
    expect(result.current.getTotalPrice()).toBe(2000);
  });

  it('should update quantity of existing item', () => {
    const { result } = renderHook(() => useCart());
    
    const mockItem = {
      id: '1',
      emri: 'Test Item',
      pershkrimi: 'Test Description',
      cmimi: 1000,
      kategoria: 'Test Category',
      eshteIGatshem: true,
      rradhaRenditjes: 1,
      krijuarNe: new Date(),
      perditesuesNe: new Date()
    };
    
    act(() => {
      result.current.addItem(mockItem, 1);
      result.current.updateQuantity('1', 3);
    });
    
    expect(result.current.items[0].sasia).toBe(3);
    expect(result.current.items[0].cmimiTotal).toBe(3000);
    expect(result.current.getTotalItems()).toBe(3);
    expect(result.current.getTotalPrice()).toBe(3000);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());
    
    const mockItem = {
      id: '1',
      emri: 'Test Item',
      pershkrimi: 'Test Description',
      cmimi: 1000,
      kategoria: 'Test Category',
      eshteIGatshem: true,
      rradhaRenditjes: 1,
      krijuarNe: new Date(),
      perditesuesNe: new Date()
    };
    
    act(() => {
      result.current.addItem(mockItem, 2);
      result.current.updateQuantity('1', 0);
    });
    
    expect(result.current.items.length).toBe(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());
    
    const mockItem = {
      id: '1',
      emri: 'Test Item',
      pershkrimi: 'Test Description',
      cmimi: 1000,
      kategoria: 'Test Category',
      eshteIGatshem: true,
      rradhaRenditjes: 1,
      krijuarNe: new Date(),
      perditesuesNe: new Date()
    };
    
    act(() => {
      result.current.addItem(mockItem, 2);
      result.current.clearCart();
    });
    
    expect(result.current.items.length).toBe(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });
});