import React, { useState, useEffect } from 'react';
import { Upload, Coffee, Utensils, Leaf, Image, X, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MenuItem, MenuCategory } from '../../types';

interface MenuItemFormProps {
  existingItem?: MenuItem | null;
  onSave: (itemData: Partial<MenuItem>, isEdit: boolean) => Promise<void>;
  onCancel: () => void;
  categories: string[];
  className?: string;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  existingItem,
  onSave,
  onCancel,
  categories,
  className = '',
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
    
    // In a real app, you would upload this to Firebase Storage
    // For now, we'll just create a local URL for preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // In reality, you would upload the image and then set the resulting URL
    setFormData(prev => ({ ...prev, imazhi: previewUrl }));
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
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData, !!existingItem);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format price display - convert from cents to decimal
  const formatPriceForInput = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  // Default categories if none are provided
  const allCategories = categories.length > 0 
    ? categories 
    : Object.values(MenuCategory);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <Input
              label="Item Name"
              name="emri"
              value={formData.emri || ''}
              onChange={handleChange}
              error={errors.emri}
              required
            />
            
            <Textarea
              label="Description"
              name="pershkrimi"
              value={formData.pershkrimi || ''}
              onChange={handleChange}
              rows={3}
            />
            
            <div className="grid grid-cols-2 gap-4">
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
              />
              
              <Input
                label="Preparation Time (min)"
                name="kohaPergatitjes"
                type="number"
                value={formData.kohaPergatitjes?.toString() || ''}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>
          </div>
          
          {/* Category and Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Category & Availability</h3>
            
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
              />
            </div>
            
            <Input
              label="Display Order"
              name="rradhaRenditjes"
              type="number"
              value={formData.rradhaRenditjes?.toString() || '0'}
              onChange={handleChange}
              helperText="Lower numbers will appear first"
              min="0"
              step="1"
            />
          </div>
          
          {/* Dietary & Availability Toggles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Dietary & Availability</h3>
            
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
        
        {/* Image Upload */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Image</h3>
          
          <Card className="p-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              {imagePreview ? (
                <motion.div 
                  className="relative" 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={imagePreview}
                    alt="Item preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, imazhi: '' }));
                    }}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </motion.div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 p-4">
                  <Image className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-sm font-medium">Drag and drop an image, or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                </div>
              )}
              
              <input
                type="file"
                id="image-upload"
                className="hidden"
              ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
              
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              icon={<Upload className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </Button>
              
              <div className="text-xs text-gray-500 mt-2 text-center">
                A clear, high-quality image will help sell your menu item
              </div>
            </div>
          </Card>
          
          {/* Image URL input (alternative to file upload) */}
          <div className="mt-4">
            <Input
              label="Or Enter Image URL (Pexels or other secure source)"
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
              placeholder="https://example.com/image.jpg"
            />
            {formData.imazhi && !imagePreview && (
              <div className="mt-2 flex items-center text-orange-700 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                Could not load preview. Check if the URL is valid and accessible.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
          className="bg-gradient-to-r from-blue-600 to-blue-700"
        >
          {existingItem ? 'Update Item' : 'Add to Menu'}
        </Button>
      </div>
    </form>
  );
};

// Add motion import
import { motion } from 'framer-motion';