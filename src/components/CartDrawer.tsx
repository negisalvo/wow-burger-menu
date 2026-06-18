"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShoppingCart, ShieldCheck, Ticket } from 'lucide-react';
import { MenuItem } from '../types';
import { getImageSrc } from '../lib/utils';

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, increment: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  isDarkMode: boolean;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isDarkMode,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (!isOpen) return null;

  // Math totals
  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const discount = promoApplied ? Math.round(subtotal * 0.15) : 0; // 15% discount
  const serviceFee = subtotal > 0 ? 50 : 0;
  const grandTotal = Math.max(0, subtotal - discount + serviceFee);

  const applyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'wow15') {
      setPromoApplied(true);
    } else {
      alert('Mock promo code error. Type "WOW15" to secure 15% discount!');
    }
  };

  const executeCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        onClearCart();
        setCheckoutSuccess(false);
        setPromoApplied(false);
        setPromoCode('');
        onClose();
      }, 3000);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop glass overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-950 backdrop-blur-xs cursor-crosshair"
        />

        {/* Content Slider container */}
        <motion.div
          initial={{ x: '100%', opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.9 }}
          transition={{ type: 'spring', damping: 26, stiffness: 210 }}
          className={`relative w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden ${
            isDarkMode ? 'bg-[#121216] text-white' : 'bg-white text-neutral-900'
          }`}
        >
          {/* Main header bar */}
          <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
            isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
          }`}>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#ff6b00]" />
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider">
                My Food Cart ({totalQuantity})
              </h2>
            </div>
            
            <div className="flex items-center gap-1.5">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[10px] font-bold text-red-500 hover:underline uppercase mr-2"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className={`p-2 rounded-full cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                }`}
              >
                <X className="w-4 h-4 sm:w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart states rendering wrapper */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {checkoutSuccess ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black uppercase text-emerald-500">
                  Melkam megeb! • Order Received!
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                  Your kitchen request has been routed to our flame-grates and espresso bars on Cameroon Street, Bole Road. Prepare your tastebuds!
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono select-none px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full font-black animate-pulse">
                    PREPARING DISHES...
                  </span>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="p-4 rounded-full bg-orange-500/10 text-[#ff6b00] animate-pulse">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide">
                    Your cart is starving
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mt-1 leading-normal">
                    You haven't queued any mouth-watering burgers or single-origin Ethiopian espresso brews. Explore the menu selections to add items!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase bg-[#ff6b00] hover:bg-orange-600 text-white tracking-wider cursor-pointer shadow-sm shadow-orange-500/20"
                >
                  Select Food Items
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' 
                        : 'bg-neutral-50 border-neutral-100 hover:bg-white'
                    }`}
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                      <img
                        src={getImageSrc(cartItem.item.imageUrl)}
                        alt={cartItem.item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>

                    {/* Meta info & quantities */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs font-extrabold uppercase tracking-tight truncate">
                          {cartItem.item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(cartItem.id)}
                          className="text-neutral-500 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display pricing */}
                      <div className="text-xs font-mono text-[#ff6b00] font-bold mt-0.5">
                        {cartItem.item.price} ETB
                      </div>

                      {/* Micro inline adjuster */}
                      <div className="flex items-center justify-between mt-2">
                        <div className={`flex items-center border rounded-lg overflow-hidden shrink-0 ${
                          isDarkMode ? 'border-neutral-850' : 'border-neutral-250/70'
                        }`}>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.id, -1)}
                            className={`p-1 outline-none ${
                              isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-[1px] text-xs font-bold font-mono min-w-[20px] text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.id, 1)}
                            className={`p-1 outline-none ${
                              isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Subtotal of item */}
                        <span className="text-xs font-black font-mono">
                          {cartItem.item.price * cartItem.quantity} <span className="text-[10px] text-[#ff6b00]">ETB</span>
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing totals block - visible only if items in cart */}
          {cartItems.length > 0 && !checkoutSuccess && (
            <div className={`p-4 sm:p-5 border-t space-y-3.5 shrink-0 ${
              isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50/70 border-neutral-100'
            }`}>
              
              {/* Promo code block */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Ticket className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter Coupon (WOW15)"
                    disabled={promoApplied}
                    className={`w-full py-2 pl-9 pr-3 rounded-xl text-xs uppercase font-bold tracking-wider outline-none border transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-[#ff6b00]' 
                        : 'bg-white border-neutral-200 text-neutral-900 focus:border-[#ff6b00]'
                    }`}
                  />
                  {promoApplied && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-500">
                      SAVED 15%
                    </span>
                  )}
                </div>
                
                <button
                  onClick={applyPromo}
                  disabled={promoApplied || !promoCode}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                    promoApplied
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-850 cursor-pointer disabled:opacity-40'
                  }`}
                  id="promo-apply-btn"
                >
                  Apply
                </button>
              </div>

              {/* Totals tally */}
              <div className="space-y-2 text-xs font-bold font-mono">
                <div className="flex items-center justify-between text-neutral-450">
                  <span className="uppercase text-neutral-400">Cart Subtotal</span>
                  <span>{subtotal} ETB</span>
                </div>
                {promoApplied && (
                  <div className="flex items-center justify-between text-emerald-500">
                    <span className="uppercase text-emerald-500/80">Coupon Discount (-15%)</span>
                    <span>-{discount} ETB</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-neutral-455">
                  <span className="uppercase text-neutral-400">Service & Packaging</span>
                  <span>{serviceFee} ETB</span>
                </div>
                <div className={`border-t pt-2.5 flex items-center justify-between text-sm sm:text-base font-black ${
                  isDarkMode ? 'border-neutral-800 text-white' : 'border-neutral-250/60 text-neutral-900'
                }`}>
                  <span className="uppercase font-sans font-black tracking-tight text-[#ff6b00]">Grand Total</span>
                  <span className="text-[#ff6b00]">{grandTotal} ETB</span>
                </div>
              </div>

              {/* Checkout process confirmation */}
              <button
                onClick={executeCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gradient-to-tr from-[#ff6b00] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white font-extrabold uppercase py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-101 active:scale-99 text-center text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {checkoutLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Booking Kitchen Grates...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>Place Order Setup ({grandTotal} ETB)</span>
                  </>
                )}
              </button>

              <p className="text-[9px] text-center text-neutral-550 leading-normal max-w-[280px] mx-auto italic">
                *Order lists are locally simulated. Payments will be requested on delivery or at the physical Cameroon Street counter.
              </p>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
