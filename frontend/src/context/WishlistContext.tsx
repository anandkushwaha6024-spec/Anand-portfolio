import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await api.get('/wishlist');
          if (res.data && res.data.products) {
            setWishlistItems(res.data.products);
          }
        } catch (err) {
          console.error('Failed to load wishlist:', err);
        }
      } else {
        const saved = localStorage.getItem('shopsphere_wishlist');
        if (saved) {
          try {
            setWishlistItems(JSON.parse(saved));
          } catch (e) {
            setWishlistItems([]);
          }
        }
      }
    };
    fetchWishlist();
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('shopsphere_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const toggleWishlist = async (product: Product) => {
    const exists = wishlistItems.some((item) => item._id === product._id);
    if (user) {
      try {
        const res = await api.post('/wishlist', { productId: product._id });
        setWishlistItems(res.data.products);
        showToast(
          exists ? `Removed ${product.name} from Wishlist` : `Saved ${product.name} to Wishlist`,
          exists ? 'info' : 'success'
        );
      } catch (err: any) {
        showToast(err.message || 'Failed to update wishlist', 'error');
      }
    } else {
      if (exists) {
        setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
        showToast(`Removed ${product.name} from Wishlist`, 'info');
      } else {
        setWishlistItems((prev) => [...prev, product]);
        showToast(`Saved ${product.name} to Wishlist`, 'success');
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
