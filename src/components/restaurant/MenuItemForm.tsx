import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Coffee, 
  Utensils, 
  Leaf, 
  Image, 
  X, 
  AlertCircle, 
  Sparkles,
  Wand2,
  TrendingUp,
  Camera,
  Link,
  Zap,
  CheckCircle,
  Clock,
  DollarSign,
  Tag,
  Users,
  Eye,
  Save,
  RefreshCw
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs, Tab } from '../ui/Tabs';
import { MenuItem, MenuCategory } from '../../types';
import toast from 'react-hot-toast';

interface MenuItemFormProps {
  existingItem?: MenuItem | null;
  onSave: (itemData: Partial<MenuItem>, isEdit: boolean) => Promise<void>;
  onCancel: () => void;
  categories: string[];
  className?: string;
  onAIDescriptionGenerate?: (itemName: string) => Promise<string>;
  onAIPriceAnalysis?: (itemName: string, category: string) => Promise<number>;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  existingItem,
  onSave,
  onCancel,
  categories,
  className = '',
  onAIDescriptionGenerate,
  onAIPriceAnalysis,
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    emri: '',
    pershkrimi: '',
    cmimi: 0,
    kategoria: '',
    nenkategoria: '',
    imazhi: '',
    eshteVegan: false,
    eshteVegetarian: false,
    eshteIGatshem: true,
    kohaPergatitjes: 10,
    rradhaRenditjes: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [analyzingPrice, setAnalyzingPrice] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media' | 'ai'>('basic');
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with existing item data if editing
  useEffect(() => {
    if (existingItem) {
      setFormData({
        ...existingItem,
      });
      
      if (existingItem.imazhi) {
        setImagePreview(existingItem.imazhi);
      }
    }
  }, [existingItem]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Special handling for price - convert from decimal to cents
      if (name === 'cmimi') {
        const priceInCents = Math.round(parseFloat(value) * 100);
        return { ...prev, [name]: isNaN(priceInCents) ? 0 : priceInCents };
      }
      
      return { ...prev, [name]: value };
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle toggle changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // In a real app, you would upload this to Firebase Storage
    // For now, we'll use the preview URL
    setFormData(prev => ({ ...prev, imazhi: previewUrl }));
    
    toast.success('Image uploaded successfully');
  };

  // Handle AI description generation
  const handleAIDescription = async () => {
    if (!formData.emri || !onAIDescriptionGenerate) return;
    
    setGeneratingDescription(true);
    try {
      const description = await onAIDescriptionGenerate(formData.emri);
      setFormData(prev => ({ ...prev, pershkrimi: description }));
      toast.success('AI description generated!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setGeneratingDescription(false);
    }
  };

  // Handle AI price analysis
  const handleAIPrice = async () => {
    if (!formData.emri || !formData.kategoria || !onAIPriceAnalysis) return;
    
    setAnalyzingPrice(true);
    try {
      const suggestedPrice = await onAIPriceAnalysis(formData.emri, formData.kategoria);
      setFormData(prev => ({ ...prev, cmimi: suggestedPrice }));
      toast.success('AI price analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze price');
    } finally {
      setAnalyzingPrice(false);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.emri) {
      newErrors.emri = 'Item name is required';
    }
    
    if (!formData.kategoria) {
      newErrors.kategoria = 'Category is required';
    }
    
    if (formData.cmimi === undefined || formData.cmimi < 0) {
      newErrors.cmimi = 'Price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData, !!existingItem);
      toast.success(existingItem ? 'Menu item updated!' : 'Menu item added!');
    } catch (error) {
      toast.error('Failed to save menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format price display - convert from cents to decimal
  const formatPriceForInput = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  // Get suggested images based on item name (mock AI feature)
  const getSuggestedImages = (itemName: string) => {
    const suggestions = [
      'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    return suggestions;
  };

  // Default categories if none are provided
  const allCategories = categories.length > 0 
    ? categories 
    : Object.values(MenuCategory);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Tabs activeTab={activeTab} onChange={(tab) => setActiveTab(tab as any)} variant="pills">
        <Tab id="basic" label="Basic Info" icon={<Utensils className="w-4 h-4" />}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Item Name"
                  name="emri"
                  value={formData.emri || ''}
                  onChange={handleChange}
                  error={errors.emri}
                  required
                  placeholder="e.g., Margherita Pizza"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    options={[
                      ...allCategories.map(cat => ({ value: cat, label: cat }))
                    ]}
                    value={formData.kategoria || ''}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, kategoria: value }));
                      if (errors.kategoria) {
                        setErrors(prev => ({ ...prev, kategoria: '' }));
                      }
                    }}
                    error={errors.kategoria}
                    required
                  />
                  
                  <Input
                    label="Subcategory (Optional)"
                    name="nenkategoria"
                    value={formData.nenkategoria || ''}
                    onChange={handleChange}
                    placeholder="e.g., Vegetarian Pizzas"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Price (€)"
                      name="cmimi"
                      type="number"
                      value={formData.cmimi ? formatPriceForInput(formData.cmimi) : ''}
                      onChange={handleChange}
                      error={errors.cmimi}
                      required
                      min="0"
                      step="0.01"
                      placeholder="12.50"
                    />
                    {onAIPriceAnalysis && formData.emri && formData.kategoria && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAIPrice}
                        loading={analyzingPrice}
                        className="absolute top-8 right-2 text-purple-600 hover:text-purple-800"
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Input
                    label="Prep Time (min)"
                    name="kohaPergatitjes"
                    type="number"
                    value={formData.kohaPergatitjes?.toString() || ''}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="15"
                  />
                </div>

                <Input
                  label="Display Order"
                  name="rradhaRenditjes"
                  type="number"
                  value={formData.rradhaRenditjes?.toString() || '0'}
                  onChange={handleChange}
                  helperText="Lower numbers appear first in the menu"
                  min="0"
                  step="1"
                />
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    label="Description"
                    name="pershkrimi"
                    value={formData.pershkrimi || ''}
                    onChange={handleChange}
                    rows={4}
                    maxLength={300}
                    placeholder="Describe your dish in a way that makes customers want to order it..."
                  />
                  {onAIDescriptionGenerate && formData.emri && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAIDescription}
                      loading={generatingDescription}
                      className="mt-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                      icon={<Wand2 className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Generate with AI
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Dietary Information</h4>
                  <div className="space-y-3">
                    <Toggle
                      label="Vegetarian"
                      checked={formData.eshteVegetarian || false}
                      onChange={(checked) => handleToggleChange('eshteVegetarian', checked)}
                      color="green"
                    />
                    
                    <Toggle
                      label="Vegan"
                      checked={formData.eshteVegan || false}
                      onChange={(checked) => handleToggleChange('eshteVegan', checked)}
                      color="green"
                    />
                    
                    <Toggle
                      label="Available for Ordering"
                      checked={formData.eshteIGatshem || false}
                      onChange={(checked) => handleToggleChange('eshteIGatshem', checked)}
                      color="blue"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                size="lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                icon={<Save className="w-4 h-4" />}
                iconPosition="left"
              >
                {existingItem ? 'Update Item' : 'Add to Menu'}
              </Button>
            </div>
          </form>
        </Tab>

        <Tab id="details" label="Details" icon={<Tag className="w-4 h-4" />}>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
              
              <div className="space-y-4">
                <Input
                  label="Allergen Information"
                  placeholder="e.g., Contains gluten, dairy, nuts"
                  helperText="List all allergens present in this dish"
                />
                
                <Input
                  label="Nutritional Highlights"
                  placeholder="e.g., High protein, Low carb, Gluten-free"
                  helperText="Highlight key nutritional benefits"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Calories (optional)"
                    type="number"
                    placeholder="450"
                    helperText="Estimated calories per serving"
                  />
                  
                  <Input
                    label="Serving Size"
                    placeholder="e.g., 1 pizza, 250g, 2 pieces"
                    helperText="Typical serving size"
                  />
                </div>
                
                <Textarea
                  label="Chef's Notes"
                  placeholder="Special preparation notes, cooking tips, or ingredient sourcing information..."
                  rows={3}
                  helperText="Internal notes for kitchen staff"
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability & Timing</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Available From"
                    type="time"
                    helperText="Start time for availability"
                  />
                  
                  <Input
                    label="Available Until"
                    type="time"
                    helperText="End time for availability"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button
                        key={day}
                        type="button"
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Toggle
                  label="Limited Time Offer"
                  checked={false}
                  onChange={() => {}}
                  color="orange"
                />
              </div>
            </Card>
          </div>
        </Tab>

        <Tab id="media" label="Media" icon={<Camera className="w-4 h-4" />}>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Item Images</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={imageUploadMethod === 'url' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setImageUploadMethod('url')}
                  >
                    <Link className="w-4 h-4 mr-1" />
                    URL
                  </Button>
                  <Button
                    variant={imageUploadMethod === 'upload' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setImageUploadMethod('upload')}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <motion.div 
                  className="relative mb-6" 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={imagePreview}
                    alt="Item preview"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, imazhi: '' }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  {/* Image Info Overlay */}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Image Ready
                  </div>
                </motion.div>
              )}

              {imageUploadMethod === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  
                  <div 
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mb-3" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Image URL"
                    name="imazhi"
                    value={formData.imazhi || ''}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    leftIcon={<Image className="w-4 h-4" />}
                    placeholder="https://images.pexels.com/..."
                    helperText="Use high-quality images from Pexels or other sources"
                  />
                  
                  {/* AI Image Suggestions */}
                  {formData.emri && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        AI Suggested Images
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {getSuggestedImages(formData.emri).map((url, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, imazhi: url }));
                              setImagePreview(url);
                              toast.success('Image selected!');
                            }}
                            className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors"
                          >
                            <img
                              src={url}
                              alt={`Suggestion ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use high-resolution images (at least 800x600px)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ensure good lighting and focus on the food</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Show the actual portion size customers will receive</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid overly stylized photos that don't represent the actual dish</span>
                </div>
              </div>
            </Card>
          </div>
        </Tab>

        <Tab id="ai" label="AI Assistant" icon={<Sparkles className="w-4 h-4" />}>
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">AI Menu Assistant</h3>
                  <p className="text-purple-700 text-sm">
                    Let AI help you create compelling menu items that sell
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleAIDescription}
                  loading={generatingDescription}
                  disabled={!formData.emri}
                  className="justify-start border-purple-200 text-purple-700 hover:bg-purple-100"
                  icon={<Wand2 className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Generate Description
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleAIPrice}
                  loading={analyzingPrice}
                  disabled={!formData.emri || !formData.kategoria}
                  className="justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
                  icon={<TrendingUp className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Analyze Pricing
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Suggestions</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Visual Appeal</h4>
                      <p className="text-sm text-blue-800">
                        Items with professional photos get 40% more orders. Consider adding a high-quality image.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">Pricing Strategy</h4>
                      <p className="text-sm text-green-800">
                        Based on your category, similar items are priced between €8-15. Consider market positioning.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900 mb-1">Customer Preferences</h4>
                      <p className="text-sm text-orange-800">
                        Vegetarian options are trending 23% higher this month. Consider highlighting plant-based ingredients.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Predictions</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Estimated Popularity</span>
                  <Badge variant="success" size="sm">High</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Profit Margin</span>
                  <Badge variant="primary" size="sm">65%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Preparation Complexity</span>
                  <Badge variant="warning" size="sm">Medium</Badge>
                </div>
              </div>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};