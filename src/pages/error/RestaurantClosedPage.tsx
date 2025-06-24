import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Phone, MapPin, ArrowLeft, Home } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const RestaurantClosedPage: React.FC = () => {
  const navigate = useNavigate();

  const restaurant = {
    emri: 'Beach Bar Durrës',
    telefoni: '+355 69 123 4567',
    adresa: 'Rruga Taulantia, Durrës 2001',
    orariPunes: {
      hapeNe: '08:00',
      mbyllNe: '23:00',
      ditetJaves: ['E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë', 'E Diel']
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kthehu mbrapa
        </button>

        <Card className="text-center p-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-orange-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Restoranti është mbyllur
          </h1>

          {/* Restaurant Name */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {restaurant.emri}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Restoranti është mbyllur. Kontrolloni orarin më poshtë dhe kthehuni gjatë orave të hapjes për të urdhëruar me Urdhëro.
          </p>

          {/* Operating Hours */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-center">
              <Clock className="w-5 h-5 mr-2" />
              Orari i Punës
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Çdo ditë:</span>
                <span className="font-medium text-gray-900">
                  {restaurant.orariPunes.hapeNe} - {restaurant.orariPunes.mbyllNe}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center text-gray-600">
              <Phone className="w-5 h-5 mr-3" />
              <a 
                href={`tel:${restaurant.telefoni}`}
                className="hover:text-blue-600 transition-colors"
              >
                {restaurant.telefoni}
              </a>
            </div>
            
            <div className="flex items-center justify-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <span className="text-center">{restaurant.adresa}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = `tel:${restaurant.telefoni}`}
              className="w-full"
              icon={<Phone className="w-4 h-4" />}
              iconPosition="left"
            >
              Kontakto Restorantin
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
              icon={<Home className="w-4 h-4" />}
              iconPosition="left"
            >
              Kthehu në Urdhëro
            </Button>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Këshillë:</strong> Kontaktoni restorantin për rezervime 
              ose për të konfirmuar orarin. Urdhëro do të jetë e disponueshme sapo restoranti të hapet.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};