import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  TrendingUp, 
  Image, 
  MessageSquare,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  RefreshCw,
  Download,
  Camera,
  Globe,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { MenuItem } from '../../types';
import toast from 'react-hot-toast';

interface AIMenuAssistantProps {
  onItemGenerated: (item: Partial<MenuItem>) => void;
  existingMenu: MenuItem[];
  categories: string[];
}

export const AIMenuAssistant: React.FC<AIMenuAssistantProps> = ({
  onItemGenerated,
  existingMenu,
  categories
}) => {
  const [activeMode, setActiveMode] = useState<'generate' | 'optimize' | 'analyze' | 'translate'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<Partial<MenuItem>[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState('mediterranean');
  const [priceRange, setPriceRange] = useState('mid');
  const [targetAudience, setTargetAudience] = useState('general');

  // Mock AI generation functions
  const generateMenuItems = async () => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockItems: Partial<MenuItem>[] = [
        {
          emri: 'Mediterranean Grilled Octopus',
          pershkrimi: 'Tender octopus grilled to perfection with olive oil, herbs, and a touch of lemon, served over warm chickpea salad',
          cmimi: 1850,
          kategoria: 'Seafood',
          eshteIGatshem: true,
          kohaPergatitjes: 20,
          imazhi: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          emri: 'Truffle Mushroom Risotto',
          pershkrimi: 'Creamy Arborio rice cooked with wild mushrooms, finished with truffle oil and aged Parmesan',
          cmimi: 1650,
          kategoria: 'Pasta & Risotto',
          eshteVegetarian: true,
          eshteIGatshem: true,
          kohaPergatitjes: 25,
          imazhi: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          emri: 'Sunset Spritz',
          pershkrimi: 'House signature cocktail with Aperol, blood orange, prosecco, and a hint of rosemary',
          cmimi: 950,
          kategoria: 'Cocktails',
          eshteVegetarian: true,
          eshteVegan: true,
          eshteIGatshem: true,
          kohaPergatitjes: 5,
          imazhi: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];
      
      setGeneratedItems(mockItems);
      toast.success('AI generated 3 menu suggestions!');
    } catch (error) {
      toast.error('Failed to generate menu items');
    } finally {
      setIsProcessing(false);
    }
  };

  const optimizeExistingMenu = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Menu optimization complete! Check your recommendations.');
    } catch (error) {
      toast.error('Failed to optimize menu');
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeMenuPerformance = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Performance analysis complete! View detailed insights.');
    } catch (error) {
      toast.error('Failed to analyze menu');
    } finally {
      setIsProcessing(false);
    }
  };

  const translateMenu = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Menu translated successfully!');
    } catch (error) {
      toast.error('Failed to translate menu');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant={activeMode === 'generate' ? 'primary' : 'outline'}
          onClick={() => setActiveMode('generate')}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Wand2 className="w-6 h-6" />
          <span className="font-medium">Generate Items</span>
          <span className="text-xs opacity-75">Create new menu items</span>
        </Button>
        
        <Button
          variant={activeMode === 'optimize' ? 'primary' : 'outline'}
          onClick={() => setActiveMode('optimize')}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Target className="w-6 h-6" />
          <span className="font-medium">Optimize</span>
          <span className="text-xs opacity-75">Improve existing items</span>
        </Button>
        
        <Button
          variant={activeMode === 'analyze' ? 'primary' : 'outline'}
          onClick={() => setActiveMode('analyze')}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <BarChart3 className="w-6 h-6" />
          <span className="font-medium">Analyze</span>
          <span className="text-xs opacity-75">Performance insights</span>
        </Button>
        
        <Button
          variant={activeMode === 'translate' ? 'primary' : 'outline'}
          onClick={() => setActiveMode('translate')}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Globe className="w-6 h-6" />
          <span className="font-medium">Translate</span>
          <span className="text-xs opacity-75">Multi-language menu</span>
        </Button>
      </div>

      {/* Content Based on Active Mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeMode === 'generate' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Menu Generation
                </h3>
                
                <div className="space-y-4">
                  <Textarea
                    label="Describe what you want to create"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Create some Mediterranean seafood dishes for a beachside restaurant, focusing on fresh ingredients and traditional cooking methods..."
                    rows={3}
                    maxLength={500}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Type
                      </label>
                      <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="mediterranean">Mediterranean</option>
                        <option value="italian">Italian</option>
                        <option value="albanian">Albanian Traditional</option>
                        <option value="seafood">Seafood</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="fusion">Modern Fusion</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="budget">Budget (€5-12)</option>
                        <option value="mid">Mid-range (€12-25)</option>
                        <option value="premium">Premium (€25+)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience
                      </label>
                      <select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General Dining</option>
                        <option value="families">Families</option>
                        <option value="couples">Couples</option>
                        <option value="business">Business Dining</option>
                        <option value="tourists">Tourists</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={generateMenuItems}
                    loading={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="lg"
                    icon={<Sparkles className="w-5 h-5" />}
                    iconPosition="left"
                  >
                    Generate Menu Items with AI
                  </Button>
                </div>
              </Card>

              {/* Generated Items */}
              {generatedItems.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    AI Generated Suggestions
                  </h3>
                  
                  <div className="space-y-4">
                    {generatedItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.imazhi ? (
                              <img
                                src={item.imazhi}
                                alt={item.emri}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{item.emri}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" size="sm">{item.kategoria}</Badge>
                                <span className="font-bold text-gray-900">
                                  €{((item.cmimi || 0) / 100).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {item.pershkrimi}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {item.eshteVegetarian && (
                                  <Badge variant="success" size="sm">Vegetarian</Badge>
                                )}
                                {item.eshteVegan && (
                                  <Badge variant="success" size="sm">Vegan</Badge>
                                )}
                                {item.kohaPergatitjes && (
                                  <Badge variant="neutral" size="sm">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {item.kohaPergatitjes}min
                                  </Badge>
                                )}
                              </div>
                              
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  onItemGenerated(item);
                                  toast.success(`${item.emri} added to your menu!`);
                                }}
                                icon={<CheckCircle className="w-4 h-4" />}
                                iconPosition="left"
                              >
                                Add to Menu
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeMode === 'optimize' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Menu Optimization
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Optimization Areas</h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">Improve descriptions</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">Optimize pricing</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-gray-700">Reorder items by popularity</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-gray-700">Add missing images</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-gray-700">Update dietary tags</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Current Menu Stats</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-medium">{existingMenu.length}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items with Images:</span>
                        <span className="font-medium">
                          {existingMenu.filter(item => item.imazhi).length} 
                          ({Math.round((existingMenu.filter(item => item.imazhi).length / Math.max(existingMenu.length, 1)) * 100)}%)
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vegetarian Options:</span>
                        <span className="font-medium">
                          {existingMenu.filter(item => item.eshteVegetarian).length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available Items:</span>
                        <span className="font-medium">
                          {existingMenu.filter(item => item.eshteIGatshem).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={optimizeExistingMenu}
                  loading={isProcessing}
                  className="w-full mt-6"
                  icon={<Target className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Optimize Menu
                </Button>
              </Card>
            </div>
          )}

          {activeMode === 'analyze' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Performance Score</h4>
                  <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
                  <p className="text-sm text-gray-600">Above industry average</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Appeal</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-1">4.6</div>
                  <p className="text-sm text-gray-600">Average rating</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Profit Potential</h4>
                  <div className="text-3xl font-bold text-purple-600 mb-1">High</div>
                  <p className="text-sm text-gray-600">Optimized pricing</p>
                </Card>
              </div>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detailed Analysis
                </h3>
                
                <Button
                  onClick={analyzeMenuPerformance}
                  loading={isProcessing}
                  className="w-full"
                  icon={<BarChart3 className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Run Full Analysis
                </Button>
              </Card>
            </div>
          )}

          {activeMode === 'translate' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Multi-Language Menu
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="sq">Albanian</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Languages
                      </label>
                      <select multiple className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="en">English</option>
                        <option value="it">Italian</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={translateMenu}
                    loading={isProcessing}
                    className="w-full"
                    icon={<Globe className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Translate Menu
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* AI Features Showcase */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">
            2025 AI Features
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 text-sm">Smart Content</h4>
            <p className="text-xs text-gray-600">AI-generated descriptions and names</p>
          </div>
          
          <div className="text-center p-3">
            <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 text-sm">Image Recognition</h4>
            <p className="text-xs text-gray-600">Auto-detect dishes from photos</p>
          </div>
          
          <div className="text-center p-3">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 text-sm">Price Intelligence</h4>
            <p className="text-xs text-gray-600">Market-based pricing suggestions</p>
          </div>
          
          <div className="text-center p-3">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 text-sm">Trend Analysis</h4>
            <p className="text-xs text-gray-600">Predict popular items and trends</p>
          </div>
        </div>
      </Card>
    </div>
  );
};