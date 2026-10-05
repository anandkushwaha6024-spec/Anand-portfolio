import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ChevronRight,
  Printer,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../types';
import api from '../services/api';

const ORDER_STAGES = [
  'Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto"></div>
        <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Calculate current active stage index for tracker timeline
  const currentStageIndex = ORDER_STAGES.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Thank You for Your Order!</h1>
          <p className="text-xs text-slate-300 mt-1">
            Order ID: <span className="font-mono font-bold text-emerald-400">#{order._id}</span>
          </p>
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          We have received your order and sent a detailed invoice confirmation to <strong className="text-slate-200">{order.shippingAddress.email}</strong>.
        </p>
      </div>

      {/* Interactive Order Status Timeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-violet-400" />
            <span>Order Tracking Progress</span>
          </h3>
          <span className="px-3 py-1 bg-violet-600/20 text-violet-400 text-xs font-bold rounded-xl border border-violet-500/30">
            Status: {order.orderStatus}
          </span>
        </div>

        {/* 6-Stage Timeline */}
        <div className="py-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] px-4">
            {ORDER_STAGES.map((stageName, idx) => {
              const isPassed = currentStageIndex >= idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <React.Fragment key={stageName}>
                  <div className="flex flex-col items-center gap-2 relative">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-950 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-bold text-center ${isCurrent ? 'text-violet-400 font-black' : isPassed ? 'text-slate-200' : 'text-slate-600'}`}>
                      {stageName}
                    </span>
                  </div>

                  {idx < ORDER_STAGES.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full ${currentStageIndex > idx ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Tracking History Log */}
        {order.trackingHistory && order.trackingHistory.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400">Activity Log</h4>
            <div className="space-y-1.5 divide-y divide-slate-800/60">
              {order.trackingHistory.map((step, idx) => (
                <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-slate-200">{step.status}</span>
                    <span className="text-slate-400">— {step.note}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(step.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Item Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Purchased Items List */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Items Summary</h3>
          <div className="space-y-3 divide-y divide-slate-800">
            {order.orderItems.map((item, i) => (
              <div key={i} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-950" />
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''} {item.selectedSize ? `· ${item.selectedSize}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-white">${(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs space-y-1.5 text-slate-300">
            <div className="flex justify-between"><span>Subtotal:</span><span className="font-bold text-white">${order.subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span className="font-bold text-white">${order.shippingPrice}</span></div>
            <div className="flex justify-between"><span>Tax (18%):</span><span className="font-bold text-white">${order.taxPrice}</span></div>
            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span className="text-violet-400">${order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Shipping & Payment</h3>

          <div className="space-y-3 text-xs">
            <div>
              <p className="font-bold text-violet-400">Delivery Address</p>
              <p className="font-semibold text-white mt-0.5">{order.shippingAddress.fullName}</p>
              <p className="text-slate-400">{order.shippingAddress.street}</p>
              <p className="text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p className="text-slate-400">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <p className="font-bold text-violet-400">Payment Information</p>
              <p className="text-slate-300 mt-0.5">Method: <strong className="text-white">{order.paymentMethod}</strong></p>
              <p className="text-slate-300">Status: <strong className="text-emerald-400">{order.paymentStatus}</strong></p>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Link
          to="/shop"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
};
