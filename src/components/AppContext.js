"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import toast from "react-hot-toast";

export const AppContext = createContext({});
export const CartContext = createContext({});

// Hook for app context
export function useAppContext() {
  return useContext(AppContext);
}

// Hook for cart context
export function useCartContext() {
  return useContext(CartContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState({ address: "Unknown" });
  const [cartProducts, setCartProducts] = useState([]);

  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, []);

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts(prev => {
      const newCartProducts = prev.filter((v, i) => i !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      toast.success("Product removed");
      return newCartProducts;
    });
  }

  function addToCart(product, size = null, extras = []) {
    setCartProducts(prev => {
      const cartProduct = { ...product, size, extras };
      const newProducts = [...prev, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <AppContext.Provider value={{ user, setUser, userLocation, setUserLocation }}>
        <CartContext.Provider value={{ cartProducts, setCartProducts, addToCart, removeCartProduct, clearCart }}>
          {children}
        </CartContext.Provider>
      </AppContext.Provider>
    </SessionProvider>
  );
}
