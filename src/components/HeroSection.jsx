import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "../context/CartContext";
import "./HeroSection.css";

gsap.registerPlugin(useGSAP);

const MENU_PRODUCTS = [
  {
    name: "VD Burger",
    image: "/vd-burger.png",
    price: 13000,
    description:
      "Pan de papa, doble medallón, cheddar, lechuga, cebolla, pepino y salsa bic mac.",
  },
  {
    name: "Cheese Burger",
    image: "/chesse.png",
    price: 13000,
    description:
      "Pan de papa, doble medallón, cheddar, panceta y salsa alioli (salsa de ajo).",
  },
  {
    name: "Clásica",
    image: "/clasica.png",
    price: 13000,
    description:
      "Pan de papa, doble medallón, lechuga, tomate, cebolla y mayonesa.",
  },
  {
    name: "Americana",
    image: "/americana.png",
    price: 13000,
    description:
      "Pan de papa, doble medallón, cheddar, cebolla caramelizada, panceta, huevo frito y barbacoa.",
  },
  {
    name: "Doble Cuarto",
    image: "/doble-cuarto.png",
    price: 13000,
    description:
      "Pan de papa, doble medallón, cheddar, cebolla picada y ketchup.",
  },
  {
    name: "BriAgus",
    image: "/bri-agus.png",
    price: 13000,
    description:
      "Pan de papa, doble medallón, cheddar, palta y salsa alioli (salsa de ajo).",
  },
  {
    name: "Valentino",
    image: "/valentino.png",
    price: 13000,
    description:
      "Pan de papa, doble medallón, provoleta, panceta, huevo frito y salsa island (mayonesa, ketchup y mostaza).",
  },
  {
    name: "Tequeños",
    image: "/tequeños.png",
    price: 10000,
    description: "Tequeños venezolanos c/salsa alioli (10 unidades).",
  },
  {
    name: "Tiritas de pollo con queso y salsa",
    image: "/tiritas-de-pollo.png",
    price: 8000,
    description: "Tiritas de pollo c/queso super crocantes.",
  },
];

const BURGER_NAMES = new Set([
  "VD Burger",
  "Cheese Burger",
  "Clásica",
  "Americana",
  "Doble Cuarto",
  "BriAgus",
  "Valentino",
]);

const OPEN_HOUR = 20;
const CLOSE_HOUR = 23;
const WHATSAPP_NUMBER = "NUMERO";

function getBusinessStatus() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = OPEN_HOUR * 60;
  const closeMinutes = CLOSE_HOUR * 60;
  const isOpen = minutes >= openMinutes && minutes < closeMinutes;

  return {
    isOpen,
    label: isOpen ? "Abierto ahora" : "Cerrado · Abre a las 20:00",
  };
}

export default function HeroSection() {
  const heroRef = useRef(null);
  const drawerOverlayRef = useRef(null);
  const drawerPanelRef = useRef(null);
  const floatingWhatsappRef = useRef(null);
  const [selectedProductName, setSelectedProductName] = useState("VD Burger");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [businessStatus, setBusinessStatus] = useState(getBusinessStatus);
  const {
    items,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    itemCount,
    subtotal,
  } = useCart();
  const selectedProduct =
    MENU_PRODUCTS.find((product) => product.name === selectedProductName) ??
    MENU_PRODUCTS[0];
  const statusClassName = businessStatus.isOpen ? "hero__status--open" : "hero__status--closed";

  const whatsappOrderUrl = useMemo(() => {
    const itemsText = items
      .map(
        (item) =>
          `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})`,
      )
      .join("%0A");
    const text = `Hola! Quiero hacer un pedido en VD Burger:%0A${itemsText}%0ATotal: $${subtotal.toLocaleString("es-AR")}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [items, subtotal]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setBusinessStatus(getBusinessStatus());
    }, 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.7,
          ease: "power3.out",
        },
      });

      tl.from("[data-hero-item]", {
        y: 34,
        autoAlpha: 0,
        stagger: 0.1,
      });

      gsap.to(".hero__burger-svg", {
        y: -14,
        rotation: 2,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    }, heroRef);

    return () => ctx.revert();
  }, { scope: heroRef });

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero__spotlight",
        { y: 18, autoAlpha: 0.2 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" },
      );

      gsap.fromTo(
        ".hero__spotlight-image",
        { scale: 0.93, autoAlpha: 0.4 },
        { scale: 1, autoAlpha: 1, duration: 0.45, ease: "power2.out" },
      );
    }, heroRef);

    return () => ctx.revert();
  }, { scope: heroRef, dependencies: [selectedProductName], revertOnUpdate: true });

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (!drawerOverlayRef.current || !drawerPanelRef.current) {
        return;
      }
  
      const drawerWidth = drawerPanelRef.current.offsetWidth;
  
      if (isDrawerOpen) {
        // Overlay
        gsap.set(drawerOverlayRef.current, { pointerEvents: "auto" });
        gsap.to(drawerOverlayRef.current, {
          autoAlpha: 1,
          duration: 0.24,
          ease: "power2.out",
        });
  
        // Drawer
        gsap.to(drawerPanelRef.current, {
          x: 0,
          duration: 0.32,
          ease: "power3.out",
        });
  
        // WhatsApp (se corre)
        if (floatingWhatsappRef.current) {
          gsap.to(floatingWhatsappRef.current, {
            x: -drawerWidth,
            scale: 0.9,
            opacity: 0.8,
            duration: 0.32,
            ease: "power3.out",
          });
        }
      } else {
        // Drawer
        gsap.to(drawerPanelRef.current, {
          x: "100%",
          duration: 0.28,
          ease: "power3.in",
        });
  
        // Overlay
        gsap.to(drawerOverlayRef.current, {
          autoAlpha: 0,
          duration: 0.24,
          ease: "power2.in",
          onComplete: () => {
            if (drawerOverlayRef.current) {
              gsap.set(drawerOverlayRef.current, { pointerEvents: "none" });
            }
          },
        });
  
        // WhatsApp (vuelve a su lugar)
        if (floatingWhatsappRef.current) {
          gsap.to(floatingWhatsappRef.current, {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 0.28,
            ease: "power3.in",
          });
        }
      }
    }, heroRef);
  
    return () => ctx.revert();
  }, { scope: heroRef, dependencies: [isDrawerOpen], revertOnUpdate: true });

  useGSAP(() => { 
    const ctx = gsap.context(() => {
      if (!floatingWhatsappRef.current) {
        return;
      }

      gsap.fromTo(
        floatingWhatsappRef.current,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.55, delay: 1.5, ease: "power3.out" },
      );
    }, heroRef);

    return () => ctx.revert();
  }, { scope: heroRef });

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__noise" aria-hidden="true" />

      <nav className="hero__nav" data-hero-item>
        <a className="hero__logo" href="#inicio" aria-label="VD Burger inicio">
          VD Burger
        </a>

        <ul className="hero__links">
          <li><a href="#menu">Menú</a></li>
          <li><a href="#reservas">Reservas</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        <div className="hero__nav-tools">
          <span className={`hero__status-badge ${statusClassName}`}>
            <span className="hero__status-dot" aria-hidden="true" />
            {businessStatus.label}
          </span>
          <button
            type="button"
            className="hero__cart-button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Abrir carrito"
          >
            <span className="hero__cart-icon" aria-hidden="true">🛒</span>
            <span className="hero__cart-text">Carrito</span>
            <span className="hero__cart-count">{itemCount}</span>
          </button>
        </div>
      </nav>

      <div className="hero__content">
        <div className="hero__copy">
          <p className="hero__kicker" data-hero-item>VD Burger House</p>
          <h1 className="hero__title" data-hero-item>
            La mejor burger
          </h1>
          <p className="hero__description" data-hero-item>
            No seguimos tendencias, las cocinamos
          </p>

          <div className="hero__actions" data-hero-item>
            <a href="#menu" className="hero__button hero__button--primary">Ver menú</a>
            <a href="#reservas" className="hero__button hero__button--secondary">Hacer reserva</a>
          </div>
        </div>

        <div className="hero__visual" data-hero-item aria-hidden="true">
          <svg
            className="hero__burger-svg"
            viewBox="0 0 460 360"
            role="img"
            aria-label="Ilustración hamburguesa"
          >
            <ellipse cx="230" cy="312" rx="156" ry="20" className="hero__shadow" />
            <path d="M110 214 Q230 152 350 214 L334 248 Q230 202 126 248 Z" className="hero__bun-bottom" />
            <rect x="120" y="192" width="220" height="20" rx="10" className="hero__cheese" />
            <path d="M118 178 Q230 142 342 178 L336 192 Q230 170 124 192 Z" className="hero__meat" />
            <path d="M116 160 Q230 130 344 160 Q334 172 322 174 Q230 150 138 174 Q126 172 116 160 Z" className="hero__lettuce" />
            <path d="M96 138 C96 72 156 42 230 42 C304 42 364 72 364 138 L356 162 C270 130 190 130 104 162 Z" className="hero__bun-top" />
            <circle cx="165" cy="98" r="4.2" className="hero__seed" />
            <circle cx="196" cy="84" r="3.7" className="hero__seed" />
            <circle cx="230" cy="92" r="4.4" className="hero__seed" />
            <circle cx="262" cy="80" r="3.9" className="hero__seed" />
            <circle cx="292" cy="98" r="4.1" className="hero__seed" />
          </svg>
        </div>
      </div>

      <div className="hero__menu-strip" data-hero-item>
        <div className="hero__menu-track">
          {MENU_PRODUCTS.map((product) => (
            <article
              className={`hero__menu-item${
                selectedProduct.name === product.name ? " hero__menu-item--active" : ""
              }`}
              key={product.name}
            >
              <button
                type="button"
                className="hero__menu-select"
                onClick={() => setSelectedProductName(product.name)}
              >
                <img
                  className="hero__menu-image"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
                <div className="hero__menu-meta">
                  <span className="hero__menu-name">{product.name}</span>
                  <span className="hero__menu-price">
                    ${product.price.toLocaleString("es-AR")}
                  </span>
                  {BURGER_NAMES.has(product.name) && (
                    <span className="hero__menu-fries-badge">+ papas incluidas</span>
                  )}
                </div>
              </button>
              <button
                type="button"
                className="hero__add-button"
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>
            </article>
          ))}
        </div>
      </div>

      <article className="hero__spotlight" data-hero-item>
        <img
          className="hero__spotlight-image"
          src={selectedProduct.image}
          alt={selectedProduct.name}
        />
        <div className="hero__spotlight-content">
          <p className="hero__spotlight-label">Producto seleccionado</p>
          <h2 className="hero__spotlight-title">{selectedProduct.name}</h2>
          <p className="hero__spotlight-description">{selectedProduct.description}</p>
          <p className="hero__spotlight-price">
            ${selectedProduct.price.toLocaleString("es-AR")}
          </p>
          {BURGER_NAMES.has(selectedProduct.name) && (
            <p className="hero__menu-fries-badge hero__menu-fries-badge--spotlight">
              + papas incluidas
            </p>
          )}
        </div>
      </article>

      <footer className="hero__footer" id="contacto">
        <p className="hero__footer-brand">VD Burger House</p>
        <span className={`hero__status-badge ${statusClassName}`}>
          <span className="hero__status-dot" aria-hidden="true" />
          {businessStatus.label}
        </span>
      </footer>

      <a
        className="hero__floating-whatsapp"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20hacer%20un%20pedido%20en%20VD%20Burger`}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp"
        ref={floatingWhatsappRef}
      >
        <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
          <path
            d="M16.03 4.01c-6.61 0-11.97 5.36-11.97 11.97 0 2.11.55 4.17 1.6 5.98L4 28l6.2-1.62a11.9 11.9 0 0 0 5.83 1.5h.01c6.61 0 11.97-5.36 11.97-11.97A11.98 11.98 0 0 0 16.03 4zm0 21.78h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.68.96.98-3.59-.23-.37a9.86 9.86 0 1 1 8.32 4.58zm5.4-7.38c-.29-.14-1.72-.85-1.99-.95-.27-.1-.47-.14-.66.14-.2.29-.76.95-.93 1.15-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.76-1.45-1.7-1.62-1.99-.17-.29-.02-.45.12-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.5h-.56c-.19 0-.5.07-.76.36-.27.29-1.03 1-1.03 2.44 0 1.43 1.05 2.82 1.19 3.01.14.19 2.05 3.13 4.96 4.38.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z"
            fill="currentColor"
          />
        </svg>
      </a>

      <div
        className="hero__cart-overlay"
        ref={drawerOverlayRef}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden={!isDrawerOpen}
      >
        <aside
          className="hero__cart-drawer"
          ref={drawerPanelRef}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="hero__cart-head">
            <h3>Tu carrito</h3>
            <button
              type="button"
              className="hero__cart-close"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Cerrar carrito"
            >
              X
            </button>
          </div>

          <div className="hero__cart-items">
            {items.length === 0 ? (
              <p className="hero__cart-empty">Todavía no agregaste productos.</p>
            ) : (
              items.map((item) => (
                <article className="hero__cart-item" key={item.name}>
                  <div className="hero__cart-item-copy">
                    <p>{item.name}</p>
                    <span>${item.price.toLocaleString("es-AR")} c/u</span>
                  </div>
                  <div className="hero__cart-controls">
                    <button type="button" onClick={() => decrementItem(item.name)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => incrementItem(item.name)}>+</button>
                    <button
                      type="button"
                      className="hero__cart-remove"
                      onClick={() => removeItem(item.name)}
                      aria-label={`Eliminar ${item.name}`}
                    >
                      X
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hero__cart-footer">
            <p>
              Subtotal
              <span>${subtotal.toLocaleString("es-AR")}</span>
            </p>
            <a
              href={items.length > 0 ? whatsappOrderUrl : "#"}
              className={`hero__order-button${items.length === 0 ? " hero__order-button--disabled" : ""}`}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => {
                if (items.length === 0) {
                  event.preventDefault();
                }
              }}
            >
              Pedir por WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
