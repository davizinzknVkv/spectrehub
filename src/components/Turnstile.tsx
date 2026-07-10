import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

export function Turnstile({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);
  // Keep callbacks in refs so parent re-renders don't tear down the widget
  // (which is what caused the "captcha keeps reloading" behavior).
  const verifyRef = useRef(onVerify);
  const expireRef = useRef(onExpire);
  useEffect(() => {
    verifyRef.current = onVerify;
    expireRef.current = onExpire;
  }, [onVerify, onExpire]);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let cancelled = false;
    const tryRender = () => {
      if (cancelled) return;
      if (!window.turnstile) {
        setTimeout(tryRender, 200);
        return;
      }
      if (idRef.current) return;
      idRef.current = window.turnstile.render(ref.current!, {
        sitekey: SITE_KEY,
        theme: "dark",
        callback: (token) => verifyRef.current(token),
        "expired-callback": () => expireRef.current?.(),
        "error-callback": () => expireRef.current?.(),
      });
    };
    tryRender();
    return () => {
      cancelled = true;
      if (idRef.current && window.turnstile) {
        try {
          window.turnstile.remove(idRef.current);
        } catch {
          /* ignore */
        }
        idRef.current = null;
      }
    };
    // Intentionally empty: widget must mount exactly once.
     
  }, []);

  if (!SITE_KEY) {
    return (
      <p className="font-mono text-[10px] text-destructive">
        VITE_TURNSTILE_SITE_KEY não configurado
      </p>
    );
  }

  return <div ref={ref} className="flex justify-center" />;
}
