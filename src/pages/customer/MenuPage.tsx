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
import { MenuItem, Restaurant, Table, MenuCategory } from '../../types';
import toast from 'react-hot-toast';

export const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  
  // Add ref to prevent duplicate welcome toasts
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
        emriPerShfaqje: isWalkIn ? `Klient Walk-in` : `Tavolina ${tableCode}`, 
        eshteAktive: true, 
        krijuarNe: new Date() 
      });
      setMenuItems([]);
      setCategories([]);
    } catch (error) {
      toast.error('Gabim në ngarkimin e menusë');
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
        emriPerShfaqje: isWalkIn ? 'Klient Walk-in' : `Tavolina ${tableCode}`,
        pershkrimi: isWalkIn 
          ? 'Porosi pa rezervim tavoline - mund të paguash direkt në kasa'
          : 'Tavolinë pranë dritares me pamje të detit dhe erë të freskët deti',
        pozicioni: isWalkIn 
          ? undefined
          : {
              x: 0,
              y: 0,
              zona: 'Terrasa me Pamje Deti'
            },
        eshteAktive: true,
        krijuarNe: new Date()
      };

      const mockMenuItems: MenuItem[] = [
        {
          id: '1',
          emri: 'Aperol Spritz',
          pershkrimi: 'Aperitiv klasik italian me Aperol, Prosecco dhe sodë, i dekoruar me portokall të freskët',
          cmimi: 850,
          kategoria: MenuCategory.PIJE,
          nenkategoria: 'Alkolike',
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
          pershkrimi: 'Pizza klasike me sos domate të freskët, mozzarella di bufala dhe borzilok të freskët nga kopshti ynë',
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
          emri: 'Sallata Greke',
          pershkrimi: 'Sallata tradicionale greke me domate të kuqe, kastravec, ullinj Kalamata dhe djathë feta origjinal',
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
          emri: 'Kafe Espresso',
          pershkrimi: 'Kafe italiane e përfektë, e përgatitur nga kokrra të zgjedhura dhe të pjekura në shtëpi',
          cmimi: 200,
          kategoria: MenuCategory.PIJE,
          nenkategoria: 'Jo-alkolike',
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
          emri: 'Peshk i Grilluar',
          pershkrimi: 'Peshk i freskët i ditës i grilluar në perfeksion me perime sezonale dhe salcë limoni',
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
          pershkrimi: 'Ëmbëlsira klasike italiane me kafe espresso, mascarpone dhe kokrra kakao',
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
          emri: 'Burger Vegan',
          pershkrimi: 'Burger 100% bimor me patate të ëmbla, quinoa dhe perime të freskëta',
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
          toast.success('Mirë se erdhe përsëri! Ja menuja e plotë.', { id: 'welcome-returning' });
        } else if (isWalkIn) {
          toast.success('Mirë se erdhe! Mund të porositësh pa rezervim tavoline.', { id: 'welcome-walkin' });
        }
        welcomeToastShownRef.current = true;
      }
    } catch (error) {
      console.error('Error loading menu:', error);
      toast.error('Gabim në ngarkimin e menusë');
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
    toast.success('Filtrat u pastruan');
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
        {/* Table Info */}
        {table && (
          <Card className={`mb-6 p-4 ${
            isWalkIn 
              ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
              : 'bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isWalkIn 
                    ? 'bg-orange-600' 
                    : 'bg-blue-600'
                }`}>
                  {isWalkIn ? (
                    <UserCheck className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-semibold text-sm">{table.kodi}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{table.emriPerShfaqje}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    {isWalkIn ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        {table.pershkrimi || 'Porosi pa rezervim tavoline'}
                      </>
                    ) : (
                      <>
                        <Wifi className="w-4 h-4 mr-1" />
                        {isReturning ? 'Mirë se erdhe përsëri!' : 'Jeni të lidhur me këtë tavolinë'}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isReturning && (
                  <Badge variant="success" size="sm">
                    <Heart className="w-3 h-3 mr-1" />
                    Vizitor i rregullt
                  </Badge>
                )}
                {isWalkIn && (
                  <Badge variant="warning" size="sm">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Walk-in
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Kërko në menu..."
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
              <span className="font-medium text-gray-900">Filtrat</span>
              {hasActiveFilters && (
                <Badge variant="primary" size="sm">
                  Aktiv
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
                {showFilters ? 'Fshih' : 'Trego'}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-blue-600"
                >
                  Pastro
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
              Të gjitha
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
                    Preferencat ushqimore
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: 'Të gjitha' },
                      { value: 'vegetarian', label: 'Vegetariane' },
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
                    Disponueshmëria
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: 'Të gjitha' },
                      { value: 'available', label: 'Të gatshme' },
                      { value: 'unavailable', label: 'Jo të gatshme' }
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
                    Çmimi
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: 'Të gjitha' },
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
                    Renditja
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">E rekomanduar</option>
                    <option value="price-low">Çmimi: Nga më i ulëti</option>
                    <option value="price-high">Çmimi: Nga më i larti</option>
                    <option value="popular">Më të popullarit</option>
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
                title={menuItems.length === 0 ? "Menuja është bosh" : "Asnjë rezultat"}
                description={
                  menuItems.length === 0 
                    ? "Ky restorant nuk ka shtuar ende artikuj në menu. Kontaktoni personalin."
                    : hasActiveFilters
                      ? "Nuk u gjetën artikuj për filtrat e zgjedhur. Provoni të ndryshoni kriteret e kërkimit."
                      : "Nuk ka artikuj të disponueshëm."
                }
                actionLabel={
                  menuItems.length === 0 
                    ? "Kontakto Personalin" 
                    : hasActiveFilters 
                      ? "Pastro filtrat" 
                      : "Rifresko Menunë"
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
                    {filteredItems.length} rezultat{filteredItems.length !== 1 ? 'e' : ''} nga {menuItems.length}
                  </span>
                  {filteredItems.filter(item => !item.eshteIGatshem).length > 0 && (
                    <div className="flex items-center text-orange-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Disa artikuj nuk janë të gatshëm
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
                  {filteredItems.length} rezultat{filteredItems.length !== 1 ? 'e' : ''}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Pastro
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};