import { useState } from 'react';
import { MenuItem } from '../types';
import toast from 'react-hot-toast';

export const useAIMenuAssistant = () => {
  const [loading, setLoading] = useState(false);

  // AI Description Generation
  const generateDescription = async (itemName: string, category?: string, cuisine?: string): Promise<string> => {
    setLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const templates = [
        `Our signature ${itemName.toLowerCase()} features premium ingredients sourced locally, expertly prepared using traditional techniques that honor authentic flavors while embracing modern culinary innovation.`,
        
        `Indulge in our exquisite ${itemName.toLowerCase()}, a perfect harmony of flavors crafted with the finest ingredients and prepared with meticulous attention to detail that defines our culinary philosophy.`,
        
        `Experience the exceptional ${itemName.toLowerCase()}, where time-honored recipes meet contemporary presentation, creating a memorable dish that celebrates both tradition and innovation.`,
        
        `Savor our carefully crafted ${itemName.toLowerCase()}, featuring hand-selected ingredients prepared with passion and expertise, delivering an unforgettable dining experience with every bite.`,
        
        `Discover our distinctive ${itemName.toLowerCase()}, a culinary masterpiece that showcases premium ingredients and expert preparation techniques, designed to delight your senses and exceed expectations.`
      ];
      
      // Add cuisine-specific elements
      const cuisineModifiers = {
        mediterranean: 'with Mediterranean herbs and olive oil',
        italian: 'following authentic Italian traditions',
        albanian: 'inspired by traditional Albanian recipes',
        seafood: 'featuring the freshest catch of the day',
        vegetarian: 'celebrating the natural flavors of fresh vegetables',
        fusion: 'blending international influences with local ingredients'
      };
      
      let selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      if (cuisine && cuisineModifiers[cuisine as keyof typeof cuisineModifiers]) {
        selectedTemplate = selectedTemplate.replace(
          'premium ingredients',
          `premium ingredients ${cuisineModifiers[cuisine as keyof typeof cuisineModifiers]}`
        );
      }
      
      return selectedTemplate;
    } catch (error) {
      throw new Error('Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  // AI Price Analysis
  const analyzePricing = async (itemName: string, category: string, cuisine?: string, priceRange?: string): Promise<number> => {
    setLoading(true);
    try {
      // Simulate AI price analysis API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Base pricing by category (in cents)
      const basePrices: Record<string, number> = {
        'Drinks': 650,
        'Pije': 650,
        'Coffee': 350,
        'Cocktails': 950,
        'Pizza': 1200,
        'Pasta': 1100,
        'Seafood': 1800,
        'Meat': 2200,
        'Salads': 850,
        'Appetizers': 750,
        'Desserts': 650,
        'Breakfast': 950
      };
      
      // Price range modifiers
      const rangeModifiers = {
        budget: 0.7,
        mid: 1.0,
        premium: 1.4
      };
      
      // Cuisine modifiers
      const cuisineModifiers = {
        mediterranean: 1.1,
        italian: 1.05,
        albanian: 0.9,
        seafood: 1.3,
        vegetarian: 0.95,
        fusion: 1.2
      };
      
      const basePrice = basePrices[category] || 1000;
      const rangeMultiplier = rangeModifiers[priceRange as keyof typeof rangeModifiers] || 1.0;
      const cuisineMultiplier = cuisineModifiers[cuisine as keyof typeof cuisineModifiers] || 1.0;
      
      // Add some intelligent variation based on item name complexity
      const complexityBonus = itemName.split(' ').length > 2 ? 1.1 : 1.0;
      
      // Random market variation (±10%)
      const marketVariation = 0.9 + (Math.random() * 0.2);
      
      const finalPrice = basePrice * rangeMultiplier * cuisineMultiplier * complexityBonus * marketVariation;
      
      return Math.round(finalPrice / 50) * 50; // Round to nearest 50 cents
    } catch (error) {
      throw new Error('Failed to analyze pricing');
    } finally {
      setLoading(false);
    }
  };

  // AI Menu Generation
  const generateMenuItems = async (
    prompt: string,
    cuisine: string,
    priceRange: string,
    targetAudience: string,
    count: number = 3
  ): Promise<Partial<MenuItem>[]> => {
    setLoading(true);
    try {
      // Simulate AI generation API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock generated items based on parameters
      const itemTemplates = {
        mediterranean: [
          {
            emri: 'Grilled Mediterranean Branzino',
            pershkrimi: 'Fresh sea bass grilled with herbs, olive oil, and lemon, served with roasted vegetables',
            kategoria: 'Seafood',
            kohaPergatitjes: 25,
            eshteIGatshem: true
          },
          {
            emri: 'Santorini Sunset Salad',
            pershkrimi: 'Mixed greens with cherry tomatoes, olives, feta cheese, and balsamic vinaigrette',
            kategoria: 'Salads',
            eshteVegetarian: true,
            kohaPergatitjes: 10,
            eshteIGatshem: true
          },
          {
            emri: 'Aegean Seafood Risotto',
            pershkrimi: 'Creamy risotto with mixed seafood, saffron, and fresh herbs',
            kategoria: 'Pasta',
            kohaPergatitjes: 30,
            eshteIGatshem: true
          }
        ],
        italian: [
          {
            emri: 'Osso Buco alla Milanese',
            pershkrimi: 'Braised veal shanks with vegetables, white wine, and gremolata',
            kategoria: 'Meat',
            kohaPergatitjes: 35,
            eshteIGatshem: true
          },
          {
            emri: 'Burrata con Pomodori',
            pershkrimi: 'Fresh burrata cheese with heirloom tomatoes and basil oil',
            kategoria: 'Appetizers',
            eshteVegetarian: true,
            kohaPergatitjes: 8,
            eshteIGatshem: true
          }
        ],
        albanian: [
          {
            emri: 'Tavë Kosi me Mish Qingji',
            pershkrimi: 'Traditional baked lamb with yogurt, rice, and aromatic herbs',
            kategoria: 'Traditional',
            kohaPergatitjes: 45,
            eshteIGatshem: true
          },
          {
            emri: 'Byrek me Spinaq',
            pershkrimi: 'Flaky phyllo pastry filled with fresh spinach and feta cheese',
            kategoria: 'Traditional',
            eshteVegetarian: true,
            kohaPergatitjes: 20,
            eshteIGatshem: true
          }
        ]
      };
      
      const selectedTemplates = itemTemplates[cuisine as keyof typeof itemTemplates] || itemTemplates.mediterranean;
      const items = selectedTemplates.slice(0, count);
      
      // Add pricing based on range
      const basePrices = {
        budget: { min: 500, max: 1200 },
        mid: { min: 1200, max: 2500 },
        premium: { min: 2500, max: 4000 }
      };
      
      const priceConfig = basePrices[priceRange as keyof typeof basePrices] || basePrices.mid;
      
      return items.map(item => ({
        ...item,
        cmimi: Math.round(priceConfig.min + Math.random() * (priceConfig.max - priceConfig.min)),
        rradhaRenditjes: Math.floor(Math.random() * 10),
        imazhi: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=400`
      }));
    } catch (error) {
      throw new Error('Failed to generate menu items');
    } finally {
      setLoading(false);
    }
  };

  // Image Analysis and Suggestions
  const analyzeImage = async (imageUrl: string): Promise<{
    category: string;
    suggestedName: string;
    confidence: number;
  }> => {
    setLoading(true);
    try {
      // Simulate AI image analysis
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock analysis results
      const mockAnalysis = {
        category: 'Pizza',
        suggestedName: 'Margherita Pizza',
        confidence: 92
      };
      
      return mockAnalysis;
    } catch (error) {
      throw new Error('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  // Nutritional Information Generation
  const generateNutritionalInfo = async (itemName: string, ingredients: string[]): Promise<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    allergens: string[];
  }> => {
    setLoading(true);
    try {
      // Simulate nutritional analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock nutritional data
      return {
        calories: 350 + Math.floor(Math.random() * 300),
        protein: 15 + Math.floor(Math.random() * 25),
        carbs: 25 + Math.floor(Math.random() * 40),
        fat: 10 + Math.floor(Math.random() * 20),
        allergens: ['gluten', 'dairy'].slice(0, Math.floor(Math.random() * 3))
      };
    } catch (error) {
      throw new Error('Failed to generate nutritional information');
    } finally {
      setLoading(false);
    }
  };

  // Menu Optimization Suggestions
  const getOptimizationSuggestions = async (menu: MenuItem[]): Promise<{
    suggestions: Array<{
      type: 'pricing' | 'description' | 'image' | 'category' | 'availability';
      itemId: string;
      current: string;
      suggested: string;
      impact: 'low' | 'medium' | 'high';
      reason: string;
    }>;
    overallScore: number;
  }> => {
    setLoading(true);
    try {
      // Simulate optimization analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock optimization suggestions
      return {
        suggestions: [
          {
            type: 'description',
            itemId: '1',
            current: 'Classic pizza with tomatoes',
            suggested: 'Wood-fired Neapolitan pizza with San Marzano tomatoes, buffalo mozzarella, and fresh basil',
            impact: 'high',
            reason: 'More descriptive language increases order likelihood by 35%'
          },
          {
            type: 'pricing',
            itemId: '2',
            current: '€8.50',
            suggested: '€9.50',
            impact: 'medium',
            reason: 'Price is 15% below market average for similar items'
          },
          {
            type: 'image',
            itemId: '3',
            current: 'No image',
            suggested: 'Add professional food photo',
            impact: 'high',
            reason: 'Items with images see 40% more orders'
          }
        ],
        overallScore: 87
      };
    } catch (error) {
      throw new Error('Failed to generate optimization suggestions');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateDescription,
    analyzePricing,
    generateMenuItems,
    analyzeImage,
    generateNutritionalInfo,
    getOptimizationSuggestions
  };
};