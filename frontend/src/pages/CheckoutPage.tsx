import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  CreditCard,
  Truck,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Banknote,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const { cartItems, subtotal, discount, tax, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Step 1 Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    country: user?.addresses?.[0]?.country || 'USA',
    zipCode: user?.addresses?.[0]?.zipCode || ''
  });

  // Step 2 Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard Delivery' | 'Express Delivery'>('Standard Delivery');

  // Step 3 Payment State
  const [paymentMethod, setPaymentMethod] = useState<'Credit/Debit Card' | 'UPI' | 'Cash on Delivery'>('Credit/Debit Card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name || 'Alex Johnson',
    expiry: '12/28',
    cvv: '•••'
  });
  const [upiId, setUpiId] = useState('alex@upi');

  const [placingOrder, setPlacingOrder] = useState(false);

  const deliveryCost = deliveryMethod === 'Express Delivery' ? 25 : (subtotal > 150 ? 0 : 15);
  const finalTotalAmount = Math.max(0, subtotal - discount + tax + deliveryCost);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
      showToast('Please fill out all required address fields', 'error');
      return;
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          price: item.product.finalPrice || item.product.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        })),
        shippingAddress,
        deliveryMethod,
        paymentMethod,
        subtotal,
        shippingPrice: deliveryCost,
        taxPrice: tax,
        discountAmount: discount,
        totalAmount: finalTotalAmount
      };

      const res = await api.post('/orders', orderData);
      const createdOrder = res.data;
      
      showToast('Order placed successfully!', 'success');
      clearCart();
      navigate(`/order-confirmation/${createdOrder._id}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Checkout Header & Step Progress Bar */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black text-white">Checkout</h1>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
          {[
            { step: 1, label: 'Address', icon: MapPin },
            { step: 2, label: 'Delivery', icon: Truck },
            { step: 3, label: 'Payment', icon: CreditCard },
            { step: 4, label: 'Review', icon: Check }
          ].map((item, idx) => {
            const Icon = item.icon;
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <React.Fragment key={item.step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : isCurrent
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 ring-4 ring-violet-600/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>

                {idx < 3 && (
                  <div className={`h-0.5 w-6 sm:w-12 rounded-full ${currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Multi-step Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: Shipping Address */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <MapPin className="w-5 h-5 text-violet-400" />
                <span>Step 1 — Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House no., street name, apartment"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Country *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">ZIP / Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery Method */}
          {currentStep === 2 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <Truck className="w-5 h-5 text-violet-400" />
                <span>Step 2 — Delivery Method</span>
              </h2>

              <div className="space-y-4">
                {/* Standard Delivery */}
                <div
                  onClick={() => setDeliveryMethod('Standard Delivery')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    deliveryMethod === 'Standard Delivery'
                      ? 'bg-violet-600/10 border-violet-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'Standard Delivery' ? 'border-violet-500 bg-violet-500' : 'border-slate-700'}`}>
                      {deliveryMethod === 'Standard Delivery' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Standard Delivery</h4>
                      <p className="text-xs text-slate-400">Delivered within 3-5 business days</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-violet-400">{subtotal > 150 ? 'FREE' : '$15'}</span>
                </div>

                {/* Express Delivery */}
                <div
                  onClick={() => setDeliveryMethod('Express Delivery')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    deliveryMethod === 'Express Delivery'
                      ? 'bg-violet-600/10 border-violet-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'Express Delivery' ? 'border-violet-500 bg-violet-500' : 'border-slate-700'}`}>
                      {deliveryMethod === 'Express Delivery' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Express Delivery</h4>
                      <p className="text-xs text-slate-400">Priority air shipping within 24-48 hours</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-violet-400">$25</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {currentStep === 3 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <CreditCard className="w-5 h-5 text-violet-400" />
                <span>Step 3 — Payment Details</span>
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit/Debit Card')}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'Credit/Debit Card'
                      ? 'border-violet-500 bg-violet-600/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'UPI'
                      ? 'border-violet-500 bg-violet-600/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-violet-500 bg-violet-600/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs">Cash on Delivery</span>
                </button>
              </div>

              {/* Card Payment Form Simulation */}
              {paymentMethod === 'Credit/Debit Card' && (
                <div className="space-y-4 p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted Card Processing</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-xs text-slate-400 font-semibold">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5"
                  />
                  <p className="text-[10px] text-slate-500">Pay directly using Google Pay, PhonePe, or Paytm.</p>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300">
                  Pay with cash upon delivery at your doorstep. Standard verification code will be sent to your phone upon dispatch.
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Delivery</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Order Review & Placement */}
          {currentStep === 4 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Step 4 — Final Order Review</span>
              </h2>

              {/* Items List */}
              <div className="space-y-3 divide-y divide-slate-800">
                {cartItems.map((item) => (
                  <div key={item._id || item.product._id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-950" />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.product.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">${((item.product.finalPrice || item.product.price) * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Address & Delivery Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/60">
                  <p className="font-bold text-violet-400 mb-1">Shipping To:</p>
                  <p className="font-semibold text-white">{shippingAddress.fullName}</p>
                  <p className="text-slate-400">{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p className="text-slate-400">Phone: {shippingAddress.phone}</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/60">
                  <p className="font-bold text-violet-400 mb-1">Payment & Delivery:</p>
                  <p className="text-slate-300">Method: <strong className="text-white">{paymentMethod}</strong></p>
                  <p className="text-slate-300">Delivery: <strong className="text-white">{deliveryMethod}</strong></p>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Payment</span>
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  {placingOrder ? 'Processing Order...' : 'Place Order Now'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 sticky top-28">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Order Details</h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-white">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({deliveryMethod})</span>
                <span className="font-bold text-white">${deliveryCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (18%)</span>
                <span className="font-bold text-white">${tax}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-3 border-t border-slate-800">
                <span>Total Due</span>
                <span className="text-violet-400">${finalTotalAmount}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full buyer protection & instant refund guarantee.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
