import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, Heart, Clock, Leaf, AlertCircle, SlidersHorizontal, UserCheck, Wifi } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { MenuItemCard } from '../../components/business/MenuItemCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { MenuItemSkeleton } from '../../components/ui/SkeletonLoader';
import { CustomerStatusBanner } from '../../components/ui/CustomerStatusBanner';
import { MenuItem, Restaurant, Table, MenuCategory } from '../../types';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import toast from 'react-hot-toast';

export const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useCustomerAuth();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'vegan' | 'vegetarian'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'popular'>('default');
  
  const welcomeToastShownRef = useRef(false);

  const restaurantSlug = searchParams.get('r');
  const tableCode = searchParams.get('t');
  const isReturning = searchParams.get('returning') === 'true';
  const isWalkIn = tableCode === 'walk-in';

  useEffect(() => {
    if (!restaurantSlug || !tableCode) {
      navigate('/');
      return;
    }

    if (restaurantSlug === 'empty-restaurant') {
      loadEmptyMenu();
    } else {
      loadMenuData();
    }
  }, [restaurantSlug, tableCode]);

  useEffect(() => {
    filterAndSortMenuItems();
  }, [menuItems, selectedCategory, searchQuery, dietaryFilter, availabilityFilter, priceRange, sortBy]);

  const loadEmptyMenu = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRestaurant: Restaurant = {
        id: '2',
        emri: 'Restaurant i Ri',
        slug: 'empty-restaurant',
        email: 'info@empty.al',
        eshteAktiv: true,
        krijuarNe: new Date(),
        perditesuesNe: new Date()
      };

      setRestaurant(mockRestaurant);
      setTable({ 
        id: '2', 
        kodi: tableCode!, 
        emriPerShfaqje: isWalkIn ? `Walk-in Customer` : `Table ${tableCode}`, 
        eshteAktive: true, 
        krijuarNe: new Date() 
      });
      setMenuItems([]);
      setCategories([]);
    } catch (error) {
      toast.error('Error loading menu');
    } finally {
      setLoading(false);
    }
  };

  const loadMenuData = async () => {
    try {
      const mockRestaurant: Restaurant = {
        id: '1',
        emri: 'Beach Bar Durrës',
        slug: 'beach-bar-durres',
        email: 'info@beachbar.al',
        eshteAktiv: true,
        krijuarNe: new Date(),
        perditesuesNe: new Date()
      };

      const mockTable: Table = {
        id: '1',
        kodi: tableCode!,
        emriPerShfaqje: isWalkIn ? 'Walk-in Customer' : `Table ${tableCode}`,
        pershkrimi: isWalkIn 
          ? 'Order without table assignment - pay at counter or wait for service'
          : 'Premium table with sea view and relaxing atmosphere',
        pozicioni: isWalkIn 
          ? undefined
          : {
              x: 0,
              y: 0,
              zona: 'VIP Terrace with Sea View'
            },
        eshteAktive: true,
        krijuarNe: new Date()
      };

      const mockMenuItems: MenuItem[] = [
        {
          id: '1',
          emri: 'Aperol Spritz',
          pershkrimi: 'Classic Italian aperitif with Aperol, Prosecco and soda, garnished with fresh orange',
          cmimi: 850,
          kategoria: MenuCategory.PIJE,
          nenkategoria: 'Alcoholic',
          imazhi: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg?auto=compress&cs=tinysrgb&w=400',
          eshteIGatshem: true,
          eshteVegetarian: true,
          kohaPergatitjes: 5,
          rradhaRenditjes: 1,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        },
        {
          id: '2',
          emri: 'Pizza Margherita',
          pershkrimi: 'Classic pizza with fresh tomato sauce, buffalo mozzarella and fresh basil from our garden',
          cmimi: 1200,
          kategoria: MenuCategory.PIZZA,
          imazhi: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
          eshteIGatshem: true,
          eshteVegetarian: true,
          kohaPergatitjes: 15,
          rradhaRenditjes: 1,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        },
        {
          id: '3',
          emri: 'Greek Salad',
          pershkrimi: 'Traditional Greek salad with fresh tomatoes, cucumber, Kalamata olives and original feta cheese',
          cmimi: 900,
          kategoria: MenuCategory.SALLATAT,
          imazhi: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
          eshteIGatshem: true,
          eshteVegetarian: true,
          eshteVegan: false,
          kohaPergatitjes: 8,
          rradhaRenditjes: 1,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        },
        {
          id: '4',
          emri: 'Espresso Coffee',
          pershkrimi: 'Perfect Italian coffee, prepared from selected beans roasted in-house',
          cmimi: 200,
          kategoria: MenuCategory.PIJE,
          nenkategoria: 'Non-alcoholic',
          imazhi: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
          eshteIGatshem: true,
          eshteVegan: true,
          kohaPergatitjes: 3,
          rradhaRenditjes: 2,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        },
        {
          id: '5',
          emri: 'Grilled Fish',
          pershkrimi: 'Catch of the day grilled to perfection with seasonal vegetables and lemon sauce',
          cmimi: 1800,
          kategoria: MenuCategory.PESHK,
          imazhi: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
          eshteIGatshem: true,
          kohaPergatitjes: 20,
          rradhaRenditjes: 1,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        },
        {
          id: '6',
          emri: 'Tiramisu',
          pershkrimi: 'Classic Italian dessert with espresso coffee, mascarpone and cocoa beans',
          cmimi: 700,
          kategoria: MenuCategory.EMBELSIRA,
          imazhi: 'https://images.pexels.com/photos/6046493/pexels-photo-6046493.jpeg?auto=compress&cs=tinysrgb&w=400',
          eshteIGatshem: false,
          eshteVegetarian: true,
          kohaPergatitjes: 5,
          rradhaRenditjes: 1,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        },
        {
          id: '7',
          emri: 'Vegan Burger',
          pershkrimi: '100% plant-based burger with sweet potatoes, quinoa and fresh vegetables',
          cmimi: 1100,
          kategoria: MenuCategory.USHQIM,
          imazhi: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
          eshteIGatshem: true,
          eshteVegan: true,
          eshteVegetarian: true,
          kohaPergatitjes: 12,
          rradhaRenditjes: 2,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        }
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setRestaurant(mockRestaurant);
      setTable(mockTable);
      setMenuItems(mockMenuItems);

      // Get unique categories
      const uniqueCategories = [...new Set(mockMenuItems.map(item => item.kategoria))];
      setCategories(uniqueCategories);

      // Show welcome message only once and only for specific scenarios
      if (!welcomeToastShownRef.current) {
        if (isReturning) {
          toast.success('Welcome back! Here\'s the full menu.', { id: 'welcome-returning' });
        } else if (isWalkIn) {
          toast.success('Welcome! You can order without a table reservation.', { id: 'welcome-walkin' });
        }
        welcomeToastShownRef.current = true;
      }
    } catch (error) {
      console.error('Error loading menu:', error);
      toast.error('Error loading menu');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMenuItems = () => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.kategoria === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.emri.toLowerCase().includes(query) ||
        item.pershkrimi.toLowerCase().includes(query) ||
        item.kategoria.toLowerCase().includes(query)
      );
    }

    // Filter by dietary preferences
    if (dietaryFilter === 'vegan') {
      filtered = filtered.filter(item => item.eshteVegan);
    } else if (dietaryFilter === 'vegetarian') {
      filtered = filtered.filter(item => item.eshteVegetarian);
    }

    // Filter by availability
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(item => item.eshteIGatshem);
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(item => !item.eshteIGatshem);
    }

    // Filter by price range
    if (priceRange === 'low') {
      filtered = filtered.filter(item => item.cmimi <= 500);
    } else if (priceRange === 'medium') {
      filtered = filtered.filter(item => item.cmimi > 500 && item.cmimi <= 1200);
    } else if (priceRange === 'high') {
      filtered = filtered.filter(item => item.cmimi > 1200);
    }

    // Sort items
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.cmimi - b.cmimi);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.cmimi - a.cmimi);
        break;
      case 'popular':
        // Mock popularity - in real app this would be based on order frequency
        filtered.sort((a, b) => b.rradhaRenditjes - a.rradhaRenditjes);
        break;
      default:
        // Sort by availability first, then by sort order
        filtered.sort((a, b) => {
          if (a.eshteIGatshem !== b.eshteIGatshem) {
            return a.eshteIGatshem ? -1 : 1;
          }
          return a.rradhaRenditjes - b.rradhaRenditjes;
        });
    }

    setFilteredItems(filtered);
  };

  const handleBackClick = () => {
    navigate(`/qr-landing?r=${restaurantSlug}&t=${tableCode}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setDietaryFilter('all');
    setAvailabilityFilter('all');
    setPriceRange('all');
    setSortBy('default');
    toast.success('Filters cleared');
  };

  const hasActiveFilters = selectedCategory || searchQuery || dietaryFilter !== 'all' || 
                          availabilityFilter !== 'all' || priceRange !== 'all' || sortBy !== 'default';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBack onBackClick={handleBackClick} showCart />
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Table Info Skeleton */}
          <div className="bg-white rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="h-12 bg-gray-200 rounded-xl mb-4 animate-pulse" />

          {/* Category Filter Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 bg-gray-200 rounded-full w-20 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Menu Items Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <MenuItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={restaurant?.emri}
        showBack 
        onBackClick={handleBackClick}
        showCart 
      />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Customer Status Banner */}
        <CustomerStatusBanner 
          user={user}
          isAuthenticated={isAuthenticated}
          venue={restaurant ? { name: restaurant.emri, type: 'restaurant' } : undefined}
          className="mb-4"
        />

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('menu.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{t('menu.filters')}</span>
              {hasActiveFilters && (
                <Badge variant="primary" size="sm">
                  {t('menu.activeFilters')}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600"
              >
                <SlidersHorizontal className="w-4 h-4 mr-1" />
                {showFilters ? t('common.hide') : t('common.show')}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-blue-600"
                >
                  {t('menu.clearAll')}
                </Button>
              )}
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {t('menu.categories.all')}
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="space-y-4">
                {/* Dietary Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Leaf className="w-4 h-4 inline mr-1" />
                    Dietary preferences
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'vegetarian', label: 'Vegetarian' },
                      { value: 'vegan', label: 'Vegan' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setDietaryFilter(option.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          dietaryFilter === option.value
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Availability
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'available', label: 'Available' },
                      { value: 'unavailable', label: 'Unavailable' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setAvailabilityFilter(option.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          availabilityFilter === option.value
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'low', label: '< 5€' },
                      { value: 'medium', label: '5-12€' },
                      { value: 'high', label: '> 12€' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setPriceRange(option.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          priceRange === option.value
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card className="p-8">
              <EmptyState
                icon={menuItems.length === 0 ? "🍽️" : "🔍"}
                title={menuItems.length === 0 ? "Menu is empty" : "No results"}
                description={
                  menuItems.length === 0 
                    ? "This venue hasn't added menu items yet. Contact staff for assistance."
                    : hasActiveFilters
                      ? "No items found for the selected filters. Try changing your search criteria."
                      : "No items available."
                }
                actionLabel={
                  menuItems.length === 0 
                    ? "Contact Staff" 
                    : hasActiveFilters 
                      ? "Clear filters" 
                      : "Refresh Menu"
                }
                onAction={
                  menuItems.length === 0 
                    ? () => window.location.href = `tel:${restaurant?.telefoni || ''}`
                    : hasActiveFilters 
                      ? clearAllFilters 
                      : () => window.location.reload()
                }
              />
            </Card>
          ) : (
            <>
              {/* Results Summary */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>
                    {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} from {menuItems.length}
                  </span>
                  {filteredItems.filter(item => !item.eshteIGatshem).length > 0 && (
                    <div className="flex items-center text-orange-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Some items are unavailable
                    </div>
                  )}
                </div>
              )}
              
              {filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </>
          )}
        </div>

        {/* Active Filters Summary (Mobile Sticky) */}
        {hasActiveFilters && filteredItems.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <Card className="shadow-lg px-4 py-2 bg-white border border-gray-200">
              <div className="flex items-center space-x-2 text-sm">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">
                  {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};