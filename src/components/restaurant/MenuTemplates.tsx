import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Coffee, 
  Pizza, 
  Fish, 
  Utensils,
  Leaf,
  Star,
  Clock,
  Users,
  TrendingUp,
  Download,
  Plus,
  Check,
  Eye,
  Globe,
  Crown
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MenuItem, MenuCategory } from '../../types';
import toast from 'react-hot-toast';

interface MenuTemplate {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  itemCount: number;
  category: string;
  priceRange: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  popularity: number;
  items: Partial<MenuItem>[];
  tags: string[];
  previewImage: string;
  estimatedSetupTime: number;
  targetAudience: string[];
}

interface MenuTemplatesProps {
  onTemplateSelect: (template: MenuTemplate) => void;
  onItemsImport: (items: Partial<MenuItem>[]) => void;
}

export const MenuTemplates: React.FC<MenuTemplatesProps> = ({
  onTemplateSelect,
  onItemsImport
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<MenuTemplate | null>(null);

  // Mock template data
  const templates: MenuTemplate[] = [
    {
      id: 'mediterranean-beach',
      name: 'Mediterranean Beach Bar',
      description: 'Fresh seafood, light bites, and refreshing cocktails perfect for beachside dining',
      cuisine: 'Mediterranean',
      itemCount: 25,
      category: 'Beach Bar',
      priceRange: '€8-35',
      difficulty: 'Easy',
      popularity: 94,
      estimatedSetupTime: 15,
      targetAudience: ['Tourists', 'Locals', 'Families'],
      tags: ['Seafood', 'Cocktails', 'Light Bites', 'Fresh'],
      previewImage: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400',
      items: [
        {
          emri: 'Grilled Sea Bream',
          pershkrimi: 'Fresh sea bream grilled with herbs and olive oil, served with lemon and vegetables',
          cmimi: 1850,
          kategoria: MenuCategory.PESHK,
          kohaPergatitjes: 20,
          eshteIGatshem: true
        },
        {
          emri: 'Aperol Spritz',
          pershkrimi: 'Classic Italian aperitif with Aperol, Prosecco, and fresh orange',
          cmimi: 850,
          kategoria: MenuCategory.KOKTEJE,
          kohaPergatitjes: 3,
          eshteIGatshem: true,
          eshteVegetarian: true
        },
        {
          emri: 'Greek Village Salad',
          pershkrimi: 'Traditional Greek salad with tomatoes, cucumber, olives, and feta',
          cmimi: 950,
          kategoria: MenuCategory.SALLATAT,
          kohaPergatitjes: 8,
          eshteIGatshem: true,
          eshteVegetarian: true
        }
      ]
    },
    {
      id: 'italian-trattoria',
      name: 'Authentic Italian Trattoria',
      description: 'Traditional Italian dishes made with imported ingredients and family recipes',
      cuisine: 'Italian',
      itemCount: 32,
      category: 'Restaurant',
      priceRange: '€12-45',
      difficulty: 'Medium',
      popularity: 89,
      estimatedSetupTime: 25,
      targetAudience: ['Food Lovers', 'Couples', 'Business Diners'],
      tags: ['Authentic', 'Traditional', 'Pasta', 'Pizza'],
      previewImage: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      items: [
        {
          emri: 'Spaghetti Carbonara',
          pershkrimi: 'Classic Roman pasta with eggs, pecorino, pancetta, and black pepper',
          cmimi: 1650,
          kategoria: MenuCategory.PASTA,
          kohaPergatitjes: 15,
          eshteIGatshem: true
        },
        {
          emri: 'Margherita Pizza',
          pershkrimi: 'Traditional Neapolitan pizza with San Marzano tomatoes and buffalo mozzarella',
          cmimi: 1400,
          kategoria: MenuCategory.PIZZA,
          kohaPergatitjes: 12,
          eshteIGatshem: true,
          eshteVegetarian: true
        }
      ]
    },
    {
      id: 'modern-fusion',
      name: 'Modern Fusion Experience',
      description: 'Contemporary dishes blending international flavors with local ingredients',
      cuisine: 'Fusion',
      itemCount: 20,
      category: 'Fine Dining',
      priceRange: '€18-65',
      difficulty: 'Advanced',
      popularity: 76,
      estimatedSetupTime: 35,
      targetAudience: ['Foodies', 'Special Occasions', 'Food Critics'],
      tags: ['Creative', 'Premium', 'Artistic', 'Innovation'],
      previewImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      items: [
        {
          emri: 'Deconstructed Baklava',
          pershkrimi: 'Modern interpretation of classic baklava with honey foam and pistachio dust',
          cmimi: 1200,
          kategoria: MenuCategory.EMBELSIRA,
          kohaPergatitjes: 18,
          eshteIGatshem: true,
          eshteVegetarian: true
        }
      ]
    },
    {
      id: 'plant-based',
      name: 'Plant-Based Paradise',
      description: 'Delicious vegan and vegetarian options that satisfy all dietary preferences',
      cuisine: 'Vegetarian',
      itemCount: 28,
      category: 'Health Food',
      priceRange: '€9-28',
      difficulty: 'Easy',
      popularity: 85,
      estimatedSetupTime: 20,
      targetAudience: ['Health Conscious', 'Vegans', 'Environmentally Aware'],
      tags: ['Vegan', 'Healthy', 'Sustainable', 'Fresh'],
      previewImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      items: [
        {
          emri: 'Buddha Bowl Supreme',
          pershkrimi: 'Quinoa base with roasted vegetables, avocado, and tahini dressing',
          cmimi: 1350,
          kategoria: MenuCategory.SALLATAT,
          kohaPergatitjes: 12,
          eshteIGatshem: true,
          eshteVegan: true,
          eshteVegetarian: true
        }
      ]
    },
    {
      id: 'quick-service',
      name: 'Fast-Casual Favorites',
      description: 'Quick, delicious meals perfect for busy customers who want quality fast food',
      cuisine: 'International',
      itemCount: 18,
      category: 'Fast Casual',
      priceRange: '€5-18',
      difficulty: 'Easy',
      popularity: 91,
      estimatedSetupTime: 10,
      targetAudience: ['Busy Professionals', 'Students', 'Families'],
      tags: ['Quick', 'Affordable', 'Popular', 'Simple'],
      previewImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
      items: [
        {
          emri: 'Gourmet Burger',
          pershkrimi: 'Premium beef patty with caramelized onions, cheese, and special sauce',
          cmimi: 1250,
          kategoria: MenuCategory.USHQIM,
          kohaPergatitjes: 8,
          eshteIGatshem: true
        }
      ]
    },
    {
      id: 'coffee-culture',
      name: 'Coffee Culture Hub',
      description: 'Specialty coffee drinks, pastries, and light meals for coffee enthusiasts',
      cuisine: 'Cafe',
      itemCount: 22,
      category: 'Cafe',
      priceRange: '€2-15',
      difficulty: 'Easy',
      popularity: 88,
      estimatedSetupTime: 12,
      targetAudience: ['Coffee Lovers', 'Remote Workers', 'Students'],
      tags: ['Coffee', 'Pastries', 'Breakfast', 'Cozy'],
      previewImage: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
      items: [
        {
          emri: 'Cappuccino Perfetto',
          pershkrimi: 'Double shot espresso with steamed milk and perfect microfoam art',
          cmimi: 450,
          kategoria: MenuCategory.KAFE,
          kohaPergatitjes: 4,
          eshteIGatshem: true,
          eshteVegan: false,
          eshteVegetarian: true
        }
      ]
    }
  ];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const cuisineMatch = selectedCuisine === 'all' || template.cuisine === selectedCuisine;
    const difficultyMatch = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return categoryMatch && cuisineMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'neutral';
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'success';
    if (popularity >= 80) return 'primary';
    if (popularity >= 70) return 'warning';
    return 'neutral';
  };

  const handleImportTemplate = async (template: MenuTemplate) => {
    try {
      await onItemsImport(template.items);
      toast.success(`Imported ${template.items.length} items from ${template.name}!`);
    } catch (error) {
      toast.error('Failed to import template');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Templates</h2>
          <p className="text-gray-600 text-sm">
            Professional menu templates designed by culinary experts
          </p>
        </div>
        <Badge variant="gradient" size="sm">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Curated
        </Badge>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Beach Bar">Beach Bar</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Fast Casual">Fast Casual</option>
              <option value="Cafe">Cafe</option>
              <option value="Health Food">Health Food</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Cuisines</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Italian">Italian</option>
              <option value="Fusion">Fusion</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="International">International</option>
              <option value="Cafe">Cafe</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Template Image */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay with quick actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                      className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleImportTemplate(template)}
                      className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Popularity Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant={getPopularityColor(template.popularity) as any} size="sm">
                    <Star className="w-3 h-3 mr-1" />
                    {template.popularity}%
                  </Badge>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant={getDifficultyColor(template.difficulty) as any} size="sm">
                    {template.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Template Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                  </div>
                </div>

                {/* Template Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Utensils className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{template.itemCount} items</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{template.estimatedSetupTime}min setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{template.cuisine}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{template.priceRange}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="neutral" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="neutral" size="sm">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Perfect for:</div>
                  <div className="text-sm text-gray-700">
                    {template.targetAudience.join(' • ')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1"
                    icon={<Eye className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleImportTemplate(template)}
                    className="flex-1"
                    icon={<Plus className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Import
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{previewTemplate.name}</h2>
                    <p className="text-gray-600">{previewTemplate.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setPreviewTemplate(null)}
                    icon={<X className="w-5 h-5" />}
                  />
                </div>

                {/* Template Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <Utensils className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{previewTemplate.itemCount}</div>
                      <div className="text-sm text-gray-600">Menu Items</div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{previewTemplate.estimatedSetupTime}</div>
                      <div className="text-sm text-gray-600">Minutes Setup</div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{previewTemplate.popularity}%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </Card>
                </div>

                {/* Sample Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Items</h3>
                  <div className="space-y-3">
                    {previewTemplate.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.emri}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{item.pershkrimi}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            €{((item.cmimi || 0) / 100).toFixed(2)}
                          </div>
                          <Badge variant="secondary" size="sm">{item.kategoria}</Badge>
                        </div>
                      </div>
                    ))}
                    
                    {previewTemplate.items.length > 3 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        +{previewTemplate.items.length - 3} more items included
                      </div>
                    )}
                  </div>
                </div>

                {/* Import Button */}
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleImportTemplate(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    icon={<Download className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Import Template
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};