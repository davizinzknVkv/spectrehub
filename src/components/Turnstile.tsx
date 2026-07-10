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
        callback: (token) => onVerify(token),
        "expired-callback": () => onExpire?.(),
        "error-callback": () => onExpire?.(),
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
  }, [onVerify, onExpire]);

  if (!SITE_KEY) {
    return (
      <p className="font-mono text-[10px] text-destructive">
        VITE_TURNSTILE_SITE_KEY não configurado
      </p>
    );
  }

  return <div ref={ref} className="flex justify-center" />;
}
