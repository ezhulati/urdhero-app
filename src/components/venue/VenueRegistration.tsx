import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Lock, 
  Check, 
  ArrowRight,
  Clock,
  Utensils,
  Coffee,
  Wine,
  Camera,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { VenueType, VENUE_CONFIGS } from '../../types';
import { useFirebase } from '../../hooks/useFirebase';
import toast from 'react-hot-toast';

export const VenueRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerVenue } = useFirebase();
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    venueType: VenueType.RESTAURANT,
    email: '',
    password: '',
    confirmPassword: '',
    
    // Contact Info
    phone: '',
    address: '',
    description: '',
    
    // Operating Hours
    openingTime: '08:00',
    closingTime: '23:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    
    // Features
    hasSeating: true,
    hasDelivery: false,
    hasTakeaway: true,
    hasWifi: true,
    hasParking: false,
    isOutdoor: false,
    
    // Payment Settings
    acceptsCash: true,
    acceptsCard: true,
    acceptsDigital: false,
    minimumCardOrder: 500, // 5 EUR
    cardFee: 2.5, // 2.5%
    
    // Additional
    website: '',
    socialMedia: {
      facebook: '',
      instagram: ''
    },
    images: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Venue name, type, and admin account',
      icon: Building
    },
    {
      id: 2,
      title: 'Contact Details',
      description: 'Location and contact information',
      icon: MapPin
    },
    {
      id: 3,
      title: 'Operating Hours',
      description: 'When your venue is open',
      icon: Clock
    },
    {
      id: 4,
      title: 'Features & Services',
      description: 'What your venue offers',
      icon: Star
    },
    {
      id: 5,
      title: 'Payment Methods',
      description: 'How customers can pay',
      icon: Clock
    },
    {
      id: 6,
      title: 'Review & Submit',
      description: 'Confirm your information',
      icon: CheckCircle
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name) newErrors.name = 'Venue name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
        
      case 2:
        if (!formData.address) newErrors.address = 'Address is required';
        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
          newErrors.phone = 'Invalid phone number format';
        }
        break;
        
      case 3:
        if (!formData.openingTime) newErrors.openingTime = 'Opening time is required';
        if (!formData.closingTime) newErrors.closingTime = 'Closing time is required';
        if (formData.workingDays.length === 0) newErrors.workingDays = 'Select at least one working day';
        break;
        
      case 5:
        if (!formData.acceptsCash && !formData.acceptsCard && !formData.acceptsDigital) {
          newErrors.payment = 'Select at least one payment method';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const venueData = {
        name: formData.name,
        type: formData.venueType,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        operatingHours: {
          openTime: formData.openingTime,
          closeTime: formData.closingTime,
          workingDays: formData.workingDays
        },
        features: {
          hasSeating: formData.hasSeating,
          hasDelivery: formData.hasDelivery,
          hasTakeaway: formData.hasTakeaway,
          hasWifi: formData.hasWifi,
          hasParking: formData.hasParking,
          isOutdoor: formData.isOutdoor
        },
        paymentSettings: {
          acceptsCash: formData.acceptsCash,
          acceptsCard: formData.acceptsCard,
          acceptsDigital: formData.acceptsDigital,
          minimumCardOrder: formData.minimumCardOrder,
          cardProcessingFee: formData.cardFee
        }
      };

      const result = await registerVenue(venueData);
      
      if (result.success) {
        toast.success('Venue registered successfully! Welcome to Urdhëro!');
        // Redirect to dashboard or login
        window.location.href = '/restaurant/dashboard';
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Venue registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Tell us about your venue and create your admin account</p>
            </div>

            <Input
              label="Venue Name *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="e.g., Beach Bar Durrës"
              required
            />

            <Select
              label="Venue Type *"
              options={Object.entries(VENUE_CONFIGS).map(([type, config]) => ({
                value: type,
                label: `${config.icon} ${config.name}`,
                icon: <span>{config.icon}</span>
              }))}
              value={formData.venueType}
              onChange={(value) => handleSelectChange('venueType', value as VenueType)}
              required
            />

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{VENUE_CONFIGS[formData.venueType].icon}</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">{VENUE_CONFIGS[formData.venueType].name}</h4>
                  <p className="text-sm text-blue-800">{VENUE_CONFIGS[formData.venueType].description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Admin Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="admin@yourvenue.com"
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
              
              <Input
                label="Admin Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="+355 69 123 4567"
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password *"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Minimum 6 characters"
                leftIcon={<Lock className="w-4 h-4" />}
                showPasswordToggle
                required
              />
              
              <Input
                label="Confirm Password *"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                leftIcon={<Lock className="w-4 h-4" />}
                showPasswordToggle
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Details</h2>
              <p className="text-gray-600">Where can customers find you?</p>
            </div>

            <Textarea
              label="Full Address *"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              placeholder="Street address, city, postal code"
              rows={3}
              required
            />

            <Textarea
              label="Venue Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your venue, atmosphere, and what makes it special..."
              rows={4}
              maxLength={300}
              helperText="This will be shown to customers when they scan your QR code"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourvenue.com"
                helperText="Optional"
              />
              
              <Input
                label="Facebook Page"
                name="facebook"
                value={formData.socialMedia.facebook}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
                placeholder="facebook.com/yourvenue"
                helperText="Optional"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Operating Hours</h2>
              <p className="text-gray-600">When is your venue open?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Opening Time *"
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleInputChange}
                error={errors.openingTime}
                required
              />
              
              <Input
                label="Closing Time *"
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleInputChange}
                error={errors.closingTime}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Working Days *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            workingDays: [...prev.workingDays, day]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            workingDays: prev.workingDays.filter(d => d !== day)
                          }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
              {errors.workingDays && (
                <p className="mt-1 text-sm text-red-600">{errors.workingDays}</p>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>Note:</strong> You can update operating hours anytime from your dashboard. 
                  Special holiday hours can be set separately.
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Features & Services</h2>
              <p className="text-gray-600">What services does your venue offer?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'hasSeating', label: 'Dine-in Seating', icon: '🪑' },
                { key: 'hasDelivery', label: 'Delivery Service', icon: '🚚' },
                { key: 'hasTakeaway', label: 'Takeaway/Pickup', icon: '🥡' },
                { key: 'hasWifi', label: 'Free WiFi', icon: '📶' },
                { key: 'hasParking', label: 'Parking Available', icon: '🅿️' },
                { key: 'isOutdoor', label: 'Outdoor Seating', icon: '🌅' }
              ].map(feature => (
                <Card key={feature.key} className="p-4 cursor-pointer" onClick={() => 
                  handleCheckboxChange(feature.key, !formData[feature.key as keyof typeof formData])
                }>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="font-medium text-gray-900">{feature.label}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      formData[feature.key as keyof typeof formData]
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300'
                    }`}>
                      {formData[feature.key as keyof typeof formData] && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Methods</h2>
              <p className="text-gray-600">How can customers pay for their orders?</p>
            </div>

            <div className="space-y-4">
              {[
                { 
                  key: 'acceptsCash', 
                  label: 'Cash Payments', 
                  description: 'Accept physical cash payments',
                  icon: '💵' 
                },
                { 
                  key: 'acceptsCard', 
                  label: 'Card Payments', 
                  description: 'Accept credit/debit card payments',
                  icon: '💳' 
                },
                { 
                  key: 'acceptsDigital', 
                  label: 'Digital Wallets', 
                  description: 'Accept Apple Pay, Google Pay, etc.',
                  icon: '📱' 
                }
              ].map(method => (
                <Card 
                  key={method.key} 
                  className={`p-4 cursor-pointer transition-all ${
                    formData[method.key as keyof typeof formData]
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCheckboxChange(method.key, !formData[method.key as keyof typeof formData])}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      formData[method.key as keyof typeof formData]
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {formData[method.key as keyof typeof formData] && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {errors.payment && (
              <div className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.payment}
              </div>
            )}

            {formData.acceptsCard && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <Input
                  label="Minimum Card Order (Lekë)"
                  type="number"
                  name="minimumCardOrder"
                  value={formData.minimumCardOrder.toString()}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    minimumCardOrder: parseInt(e.target.value) || 0
                  }))}
                  placeholder="500"
                  helperText="Minimum order amount for card payments"
                />
                
                <Input
                  label="Card Processing Fee (%)"
                  type="number"
                  name="cardFee"
                  value={formData.cardFee.toString()}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    cardFee: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="2.5"
                  min="0"
                  max="10"
                  step="0.1"
                  helperText="Fee charged to customers for card payments"
                />
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-600">Please review your information before submitting</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Venue Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{VENUE_CONFIGS[formData.venueType].name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{formData.address}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Operating Hours</h3>
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Hours:</span>
                    <span className="font-medium">{formData.openingTime} - {formData.closingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days:</span>
                    <span className="font-medium">{formData.workingDays.length} days/week</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.acceptsCash && <Badge variant="success" size="sm">💵 Cash</Badge>}
                  {formData.acceptsCard && <Badge variant="primary" size="sm">💳 Card</Badge>}
                  {formData.acceptsDigital && <Badge variant="secondary" size="sm">📱 Digital</Badge>}
                </div>
              </Card>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Ready to Launch!</h4>
                  <p className="text-sm text-green-800">
                    Your venue will be reviewed and activated within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-green-600 text-white' 
                        : isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 hidden md:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 6 ? (
              <Button
                onClick={nextStep}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                icon={<CheckCircle className="w-5 h-5" />}
                iconPosition="left"
              >
                Register Venue
              </Button>
            )}
          </div>
        </Card>

        {/* Benefits */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Why Choose Urdhëro?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-900 mb-1">Instant Orders</h4>
              <p className="text-sm text-blue-800">Customers order instantly without waiting</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-900 mb-1">Increase Revenue</h4>
              <p className="text-sm text-blue-800">20% average increase in order value</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-900 mb-1">Easy Setup</h4>
              <p className="text-sm text-blue-800">Get started in less than 30 minutes</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};