import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Plus, Download, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QRCodeGenerator } from '../../components/qr/QRCodeGenerator';
import { generateQRData } from '../../utils/qrParser';
import toast from 'react-hot-toast';

interface TableQR {
  id: string;
  tableCode: string;
  tableName: string;
  zone?: string;
  isActive: boolean;
  lastUsed?: Date;
  totalScans: number;
}

export const QRManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState<TableQR | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  
  // Mock data - in real app this would come from backend
  const [tables] = useState<TableQR[]>([
    {
      id: '1',
      tableCode: 'A15',
      tableName: 'Table A15',
      zone: 'Sea View Terrace',
      isActive: true,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalScans: 127
    },
    {
      id: '2',
      tableCode: 'B08',
      tableName: 'Table B08',
      zone: 'Garden Area',
      isActive: true,
      lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      totalScans: 89
    },
    {
      id: '3',
      tableCode: 'VIP-01',
      tableName: 'VIP Table 01',
      zone: 'VIP Section',
      isActive: true,
      lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000),
      totalScans: 45
    },
    {
      id: '4',
      tableCode: 'walk-in',
      tableName: 'Walk-in Customers',
      zone: 'General',
      isActive: true,
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000),
      totalScans: 234
    }
  ]);

  const restaurantSlug = 'beach-bar-durres';

  const handleGenerateQR = (table: TableQR) => {
    setSelectedTable(table);
    setShowGenerator(true);
  };

  const handleCopyQRData = (tableCode: string) => {
    const qrData = generateQRData(restaurantSlug, tableCode);
    navigator.clipboard.writeText(qrData);
    toast.success('QR data copied to clipboard');
  };

  const downloadAllQRCodes = () => {
    toast.success('Preparing QR codes for download...');
    // In real app, this would generate a ZIP file with all QR codes
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="QR Code Management" 
        showBack 
        onBackClick={() => navigate('/restaurant/dashboard')}
      >
        <Button
          size="sm"
          onClick={downloadAllQRCodes}
          icon={<Download className="w-4 h-4" />}
          iconPosition="left"
        >
          Download All
        </Button>
      </Header>
      
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{tables.length}</div>
                <div className="text-sm text-gray-600">Total QR Codes</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {tables.reduce((sum, table) => sum + table.totalScans, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Scans</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {tables.filter(t => t.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active Tables</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(tables.reduce((sum, table) => sum + table.totalScans, 0) / tables.length)}
                </div>
                <div className="text-sm text-gray-600">Avg. Scans/Table</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tables List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Table QR Codes</h2>
              <Button
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                iconPosition="left"
              >
                Add Table
              </Button>
            </div>

            <div className="space-y-4">
              {tables.map((table) => (
                <Card key={table.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {table.tableCode === 'walk-in' ? 'WI' : table.tableCode}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{table.tableName}</h3>
                          <Badge variant={table.isActive ? 'success' : 'neutral'} size="sm">
                            {table.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        {table.zone && (
                          <p className="text-sm text-gray-600">{table.zone}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>{table.totalScans} scans</span>
                          <span>Last used {getTimeAgo(table.lastUsed!)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyQRData(table.tableCode)}
                        icon={<Copy className="w-4 h-4" />}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateQR(table)}
                        icon={<QrCode className="w-4 h-4" />}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* QR Generator */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">QR Code Generator</h2>
            
            {selectedTable ? (
              <QRCodeGenerator
                restaurantSlug={restaurantSlug}
                tableCode={selectedTable.tableCode}
                size={300}
              />
            ) : (
              <Card className="p-8 text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Table
                </h3>
                <p className="text-gray-600">
                  Choose a table from the list to generate its QR code
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <QrCode className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">QR Code Setup Instructions</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Download the QR code images and print them in high quality</li>
                <li>• Place QR codes on tables in protective holders or laminate them</li>
                <li>• Test each QR code by scanning with a phone camera</li>
                <li>• Monitor scan statistics to track table usage</li>
                <li>• Replace damaged or worn QR codes regularly</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};