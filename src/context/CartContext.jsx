import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems((current) => {
      const existing = current.find((i) => i.cartKey === product.cartKey);
      if (existing) {
        return current.map((i) =>
          i.cartKey === product.cartKey
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const incrementItem = (cartKey) => {
    setItems((current) =>
      current.map((i) =>
        i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrementItem = (cartKey) => {
    setItems((current) =>
      current
        .map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (cartKey) => {
    setItems((current) => current.filter((i) => i.cartKey !== cartKey));
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, incrementItem, decrementItem, removeItem, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}