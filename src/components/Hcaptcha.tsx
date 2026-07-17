import { useEffect, useRef } from "react";

declare global {
  interface Window {
    hcaptcha?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark";
          rqdata?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

/**
 * Renders Discord's hCaptcha challenge. sitekey/rqdata come from Discord's
 * captcha_required response and MUST be used verbatim — otherwise the token
 * won't be accepted by Discord.
 */
export function Hcaptcha({
  sitekey,
  rqdata,
  onVerify,
  onExpire,
}: {
  sitekey: string;
  rqdata?: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);
  const verifyRef = useRef(onVerify);
  const expireRef = useRef(onExpire);
  useEffect(() => {
    verifyRef.current = onVerify;
    expireRef.current = onExpire;
  }, [onVerify, onExpire]);

  useEffect(() => {
    if (!ref.current || !sitekey) return;
    let cancelled = false;

    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (window.hcaptcha) return resolve();
        const existing = document.getElementById("hcaptcha-script") as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.id = "hcaptcha-script";
        s.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    const render = async () => {
      await ensureScript();
      if (cancelled || !ref.current || !window.hcaptcha || idRef.current) return;
      idRef.current = window.hcaptcha.render(ref.current, {
        sitekey,
        theme: "dark",
        rqdata,
        callback: (token) => verifyRef.current(token),
        "expired-callback": () => expireRef.current?.(),
        "error-callback": () => expireRef.current?.(),
      });
    };
    render();

    return () => {
      cancelled = true;
      if (idRef.current && window.hcaptcha) {
        try {
          window.hcaptcha.remove(idRef.current);
        } catch {
          /* ignore */
        }
        idRef.current = null;
      }
    };
  }, [sitekey, rqdata]);

  return <div ref={ref} className="flex justify-center" />;
}
