import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
  totalCount: number;
  applyPromoCode: (code: string) => boolean;
  promoCode: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Load cart on auth change
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await api.get('/cart');
          if (res.data && res.data.items) {
            setCartItems(res.data.items);
          }
        } catch (err) {
          console.error('Failed to load user cart:', err);
        }
      } else {
        const saved = localStorage.getItem('shopsphere_cart');
        if (saved) {
          try {
            setCartItems(JSON.parse(saved));
          } catch (e) {
            setCartItems([]);
          }
        }
      }
    };
    fetchCart();
  }, [user]);

  // Sync to local storage if user is guest
  useEffect(() => {
    if (!user) {
      localStorage.setItem('shopsphere_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product: Product, quantity = 1, color = '', size = '') => {
    if (user) {
      try {
        const res = await api.post('/cart', {
          productId: product._id,
          quantity,
          selectedColor: color,
          selectedSize: size
        });
        setCartItems(res.data.items);
        showToast(`Added ${product.name} to Cart`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to add to cart', 'error');
      }
    } else {
      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.product._id === product._id && item.selectedColor === color && item.selectedSize === size
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              _id: 'local_' + Math.random().toString(36).substring(2, 9),
              product,
              quantity,
              selectedColor: color,
              selectedSize: size
            }
          ];
        }
      });
      showToast(`Added ${product.name} to Cart`, 'success');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (user) {
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity });
        setCartItems(res.data.items);
      } catch (err: any) {
        showToast(err.message || 'Failed to update quantity', 'error');
      }
    } else {
      setCartItems((prev) =>
        prev
          .map((item) => (item._id === itemId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0)
      );
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/${itemId}`);
        setCartItems(res.data.items);
        showToast('Item removed from cart', 'info');
      } catch (err: any) {
        showToast(err.message || 'Failed to remove item', 'error');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      showToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Failed to clear server cart');
      }
    }
    setCartItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SHOPSPHERE10' || cleanCode === 'PROMO10') {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      showToast('10% Promo discount applied!', 'success');
      return true;
    } else if (cleanCode === 'WELCOME20') {
      setPromoCode(cleanCode);
      setDiscountPercent(20);
      showToast('20% Welcome discount applied!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "SHOPSPHERE10"', 'error');
      return false;
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.finalPrice || item.product?.price || 0) * item.quantity,
    0
  );

  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const tax = Math.round((subtotal - discount) * 0.18);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + tax);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        shippingFee,
        tax,
        discount,
        grandTotal,
        totalCount,
        applyPromoCode,
        promoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
