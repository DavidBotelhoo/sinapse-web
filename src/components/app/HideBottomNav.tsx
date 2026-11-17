"use client";

import { useEffect } from "react";

export function HideBottomNav() {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.hideBottomNav = "1";
    return () => {
      delete html.dataset.hideBottomNav;
    };
  }, []);
  return null;
}
