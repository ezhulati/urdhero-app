import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle,
  XCircle,
  Key,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { useRestaurantAuth } from '../../hooks/useRestaurantAuth';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
}

export const StaffManagement: React.FC = () => {
  const { currentUser } = useRestaurantAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.KAMARIER,
    permissions: [] as string[]
  });

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockStaff: StaffMember[] = [
        {
          id: '1',
          name: 'Ana Menaxhere',
          email: 'ana@beachbar.al',
          phone: '+355 69 234 5678',
          role: UserRole.MENAXHER,
          isActive: true,
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          permissions: ['orders.manage', 'menu.manage', 'staff.view', 'analytics.view']
        },
        {
          id: '2',
          name: 'Marko Kuzhina',
          email: 'marko@beachbar.al',
          phone: '+355 69 345 6789',
          role: UserRole.KUZHINIER,
          isActive: true,
          lastLogin: new Date(Date.now() - 30 * 60 * 1000),
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          permissions: ['orders.view', 'kitchen.manage']
        },
        {
          id: '3',
          name: 'Elsa Kamarieria',
          email: 'elsa@beachbar.al',
          phone: '+355 69 456 7890',
          role: UserRole.KAMARIER,
          isActive: true,
          lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          permissions: ['orders.view', 'orders.update']
        },
        {
          id: '4',
          name: 'Denis Bartender',
          email: 'denis@beachbar.al',
          role: UserRole.BARTENDER,
          isActive: false,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          permissions: ['orders.view']
        }
      ];

      setStaffMembers(mockStaff);
    } catch (error) {
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = searchTerm === '' || 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      [UserRole.ADMIN]: 'Administrator',
      [UserRole.MENAXHER]: 'Menaxher',
      [UserRole.KAMARIER]: 'Kamarier',
      [UserRole.KUZHINIER]: 'Kuzhinier',
      [UserRole.BARTENDER]: 'Bartender'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      [UserRole.ADMIN]: 'danger',
      [UserRole.MENAXHER]: 'primary',
      [UserRole.KAMARIER]: 'secondary',
      [UserRole.KUZHINIER]: 'warning',
      [UserRole.BARTENDER]: 'success'
    };
    return colors[role] || 'neutral';
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newStaff: StaffMember = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: true,
        createdAt: new Date(),
        permissions: getDefaultPermissions(formData.role)
      };

      setStaffMembers(prev => [newStaff, ...prev]);
      setShowAddModal(false);
      resetForm();
      toast.success('Staff member added successfully!');
    } catch (error) {
      toast.error('Failed to add staff member');
    }
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStaff) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedStaff = {
        ...editingStaff,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        permissions: formData.permissions
      };

      setStaffMembers(prev => 
        prev.map(staff => staff.id === editingStaff.id ? updatedStaff : staff)
      );
      
      setShowAddModal(false);
      setEditingStaff(null);
      resetForm();
      toast.success('Staff member updated successfully!');
    } catch (error) {
      toast.error('Failed to update staff member');
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setStaffMembers(prev => prev.filter(staff => staff.id !== staffToDelete.id));
      setShowDeleteModal(false);
      setStaffToDelete(null);
      toast.success('Staff member removed successfully!');
    } catch (error) {
      toast.error('Failed to remove staff member');
    }
  };

  const toggleStaffStatus = async (staffId: string, newStatus: boolean) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setStaffMembers(prev =>
        prev.map(staff =>
          staff.id === staffId ? { ...staff, isActive: newStatus } : staff
        )
      );

      toast.success(`Staff member ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update staff status');
    }
  };

  const getDefaultPermissions = (role: UserRole): string[] => {
    const permissionSets = {
      [UserRole.ADMIN]: ['orders.manage', 'menu.manage', 'staff.manage', 'analytics.manage', 'settings.manage'],
      [UserRole.MENAXHER]: ['orders.manage', 'menu.manage', 'staff.view', 'analytics.view'],
      [UserRole.KAMARIER]: ['orders.view', 'orders.update', 'customers.assist'],
      [UserRole.KUZHINIER]: ['orders.view', 'kitchen.manage'],
      [UserRole.BARTENDER]: ['orders.view', 'bar.manage']
    };
    return permissionSets[role] || [];
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: UserRole.KAMARIER,
      permissions: []
    });
  };

  const openEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || '',
      role: staff.role,
      permissions: staff.permissions
    });
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading staff members...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-600 text-sm">
            Manage restaurant staff and their permissions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingStaff(null);
            resetForm();
            setShowAddModal(true);
          }}
          icon={<UserPlus className="w-4 h-4" />}
          iconPosition="left"
        >
          Add Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{staffMembers.length}</div>
              <div className="text-sm text-gray-600">Total Staff</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {staffMembers.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {staffMembers.filter(s => s.lastLogin && s.lastLogin > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-gray-600">Online Today</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {staffMembers.filter(s => s.role === UserRole.ADMIN || s.role === UserRole.MENAXHER).length}
              </div>
              <div className="text-sm text-gray-600">Managers</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Select
            options={[
              { value: 'all', label: 'All Roles' },
              { value: UserRole.ADMIN, label: 'Administrator' },
              { value: UserRole.MENAXHER, label: 'Manager' },
              { value: UserRole.KAMARIER, label: 'Waiter' },
              { value: UserRole.KUZHINIER, label: 'Kitchen' },
              { value: UserRole.BARTENDER, label: 'Bartender' }
            ]}
            value={roleFilter}
            onChange={(value) => setRoleFilter(value as any)}
            width="w-48"
          />
        </div>
      </Card>

      {/* Staff List */}
      <div className="space-y-4">
        {filteredStaff.map(staff => (
          <motion.div
            key={staff.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                      <Badge 
                        variant={getRoleColor(staff.role) as any} 
                        size="sm"
                      >
                        {getRoleLabel(staff.role)}
                      </Badge>
                      <Badge 
                        variant={staff.isActive ? 'success' : 'neutral'} 
                        size="sm"
                      >
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {staff.email}
                      </div>
                      {staff.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {staff.phone}
                        </div>
                      )}
                      {staff.lastLogin && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {getTimeAgo(staff.lastLogin)}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {staff.permissions.slice(0, 3).map(permission => (
                        <Badge key={permission} variant="neutral" size="sm">
                          {permission}
                        </Badge>
                      ))}
                      {staff.permissions.length > 3 && (
                        <Badge variant="neutral" size="sm">
                          +{staff.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStaffStatus(staff.id, !staff.isActive)}
                    className={staff.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}
                  >
                    {staff.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(staff)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  {currentUser?.role === UserRole.ADMIN && staff.role !== UserRole.ADMIN && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setStaffToDelete(staff);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingStaff(null);
          resetForm();
        }}
        title={editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        size="md"
      >
        <div className="p-6">
          <form onSubmit={editingStaff ? handleEditStaff : handleAddStaff} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Enter staff member's name"
              />
              
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="staff@restaurant.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+355 69 123 4567"
              />
              
              <Select
                label="Role *"
                options={[
                  { value: UserRole.KAMARIER, label: 'Waiter/Server' },
                  { value: UserRole.KUZHINIER, label: 'Kitchen Staff' },
                  { value: UserRole.BARTENDER, label: 'Bartender' },
                  { value: UserRole.MENAXHER, label: 'Manager' },
                  ...(currentUser?.role === UserRole.ADMIN ? [
                    { value: UserRole.ADMIN, label: 'Administrator' }
                  ] : [])
                ]}
                value={formData.role}
                onChange={(value) => {
                  const newRole = value as UserRole;
                  setFormData({
                    ...formData, 
                    role: newRole,
                    permissions: getDefaultPermissions(newRole)
                  });
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                {[
                  'orders.view',
                  'orders.manage', 
                  'menu.view',
                  'menu.manage',
                  'kitchen.manage',
                  'analytics.view',
                  'staff.view',
                  'settings.manage'
                ].map(permission => (
                  <label key={permission} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== permission)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-gray-700">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={editingStaff ? <Edit className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                iconPosition="left"
              >
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setStaffToDelete(null);
        }}
        title="Remove Staff Member"
        size="sm"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Remove {staffToDelete?.name}?
          </h3>
          <p className="text-gray-600 mb-6">
            This staff member will lose access to the restaurant dashboard. This action can be undone by adding them again.
          </p>
          
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setStaffToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteStaff}
            >
              Remove Staff
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};