"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((reg) => {
          console.log("[NIKA PWA] Service worker registrado:", reg.scope);
        })
        .catch((err) => {
          console.error("[NIKA PWA] Error al registrar SW:", err);
        });
    }
  }, []);

  return null;
}
