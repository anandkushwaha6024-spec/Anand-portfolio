import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Settings,
  Plus,
  Trash2,
  Lock,
  Camera,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Order, Address } from '../types';
import api from '../services/api';
import { ProductCard } from '../components/products/ProductCard';

export const UserDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, logout, updateUser } = useAuth();
  const { wishlistItems } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Settings State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address Modal / Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'USA',
    zipCode: '',
    isDefault: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || ''
    });

    if (activeTab === 'orders') {
      const fetchMyOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await api.get('/orders/my-orders');
          setOrders(res.data || []);
        } catch (err) {
          console.error('Failed to load user orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [user, activeTab, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', profileData);
      updateUser(res.data);
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Password changed successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const existingAddresses = user.addresses || [];
      const updated = [...existingAddresses, newAddress];
      const res = await api.put('/auth/profile', { addresses: updated });
      updateUser(res.data);
      showToast('Address added successfully', 'success');
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        country: 'USA',
        zipCode: '',
        isDefault: false
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to add address', 'error');
    }
  };

  const handleDeleteAddress = async (idx: number) => {
    if (!user || !user.addresses) return;
    try {
      const updated = user.addresses.filter((_, i) => i !== idx);
      const res = await api.put('/auth/profile', { addresses: updated });
      updateUser(res.data);
      showToast('Address removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete address', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Title & User Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500 shadow-lg shadow-violet-500/20"
          />
          <div>
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400">{user?.email} · {user?.role.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-bold rounded-xl hover:bg-violet-600/30 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-3 h-fit">
          {[
            { id: 'profile', label: 'My Profile', icon: UserIcon },
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'addresses', label: 'Addresses', icon: MapPin },
            { id: 'settings', label: 'Account Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: Profile Overview */}
          {activeTab === 'profile' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Personal Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-slate-400">Full Name</span>
                  <p className="text-sm font-bold text-white mt-0.5">{user?.name}</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-slate-400">Email Address</span>
                  <p className="text-sm font-bold text-white mt-0.5">{user?.email}</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-slate-400">Phone Number</span>
                  <p className="text-sm font-bold text-white mt-0.5">{user?.phone || 'Not specified'}</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-slate-400">Saved Wishlist Items</span>
                  <p className="text-sm font-bold text-violet-400 mt-0.5">{wishlistItems.length} Products</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: My Orders */}
          {activeTab === 'orders' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Order History</h2>

              {loadingOrders ? (
                <div className="text-center py-10 text-xs text-slate-400 animate-pulse">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="inline-block px-4 py-2 bg-violet-600 text-white font-bold text-xs rounded-xl">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord._id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 text-xs">
                        <div>
                          <span className="font-mono font-bold text-violet-400">#{ord._id}</span>
                          <span className="text-slate-500 ml-2">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="px-3 py-1 bg-violet-600/20 text-violet-400 font-bold rounded-xl w-fit">
                          {ord.orderStatus}
                        </span>
                      </div>

                      {/* Items previews */}
                      <div className="space-y-2">
                        {ord.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-900" />
                              <span className="text-slate-200 font-medium line-clamp-1">{item.name} (x{item.quantity})</span>
                            </div>
                            <span className="font-bold text-white">${(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800/60">
                        <span className="text-slate-400">Total: <strong className="text-white">${ord.totalAmount}</strong></span>
                        <Link
                          to={`/order-confirmation/${ord._id}`}
                          className="text-violet-400 hover:underline font-bold flex items-center gap-1"
                        >
                          <span>Track & View Details</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Saved Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800">
                  <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Your wishlist is currently empty.</p>
                  <Link to="/shop" className="inline-block px-4 py-2 bg-violet-600 text-white font-bold text-xs rounded-xl">
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">Saved Delivery Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase text-violet-400">New Address Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street Address"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="ZIP Code"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <button type="submit" className="px-6 py-2 bg-violet-600 text-white font-bold text-xs rounded-xl">
                    Save Address
                  </button>
                </form>
              )}

              {/* Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 relative">
                      <p className="text-xs font-bold text-white">{addr.fullName}</p>
                      <p className="text-xs text-slate-400">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-[10px] text-slate-500">Phone: {addr.phone}</p>
                      
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No addresses saved yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Account Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Update Profile</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Avatar Image URL</label>
                    <input
                      type="url"
                      value={profileData.avatar}
                      onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <button type="submit" className="px-6 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-md">
                  Save Profile Changes
                </button>
              </form>

              {/* Password Form */}
              <form onSubmit={handleChangePassword} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Change Password</h2>
                
                <div className="space-y-3 text-xs max-w-md">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <button type="submit" className="px-6 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-md">
                  Update Password
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
