import React, { createContext, useContext, useState } from 'react';
import { Offer, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (offer: Offer, providerId: string) => void;
  removeFromCart: (offerId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (offer: Offer, providerId: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.offerId === offer.id);
      if (existing) {
        return prev.map(i => i.offerId === offer.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        offerId: offer.id,
        title: offer.title,
        quantity: 1,
        price: offer.price,
        imageUrl: offer.imageUrl,
        providerId,
        type: offer.type
      }];
    });
  };

  const removeFromCart = (offerId: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.offerId === offerId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.offerId === offerId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.offerId !== offerId);
    });
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};