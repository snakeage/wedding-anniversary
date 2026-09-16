"use client";

import { useEffect, useRef } from "react";

export function TelegramLogin({ botUsername }: { botUsername: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-auth-url", `${window.location.origin}/api/auth/telegram`);
    host.appendChild(script);
    return () => {
      host.replaceChildren();
    };
  }, [botUsername]);

  return <div ref={hostRef} className="flex justify-center py-2" />;
}
