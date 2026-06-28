import React from "react";
import { CartProvider } from "./context/CartContext";
import HeroSection from "./components/HeroSection";

export default function App() {
  return (
    <CartProvider>
      <HeroSection />
    </CartProvider>
  );
}