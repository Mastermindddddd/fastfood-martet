"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Load cart from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cart = sessionStorage.getItem('cart');
      if (cart) {
        setCartProducts(JSON.parse(cart));
      }
    }
  }, []);

  // Save cart to session storage
  useEffect(() => {
    if (cartProducts?.length > 0 && typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  // Load saved location on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('userLocation');
      if (saved) {
        try {
          setUserLocation(JSON.parse(saved));
        } catch (e) {
          sessionStorage.removeItem('userLocation');
        }
      }
    }
  }, []);

  function clearCart() {
    setCartProducts([]);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cart');
    }
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = prevCartProducts.filter((v, index) => index !== indexToRemove);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cart', JSON.stringify(newCartProducts));
      }
      return newCartProducts;
    });
    toast.success('Product removed');
  }

  function addToCart(product, size = null, extras = []) {
    setCartProducts(prevProducts => {
      const newProducts = [...prevProducts, { ...product, size, extras }];
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cart', JSON.stringify(newProducts));
      }
      return newProducts;
    });
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setUserLocation(locationData);
        setLocationLoading(false);
        
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userLocation', JSON.stringify(locationData));
        }
        
        toast.success('Location access granted');
      },
      (err) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }

  function clearLocation() {
    setUserLocation(null);
    setLocationError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userLocation');
    }
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts,
        setCartProducts,
        addToCart,
        removeCartProduct,
        clearCart,
        userLocation,
        locationError,
        locationLoading,
        requestLocation,
        clearLocation,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}