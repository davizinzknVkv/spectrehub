import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element>(threshold = 0.15): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return [ref, inView];
}

export function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const targetRef = useRef(target);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    if (!run) {
      setValue(0);
      startTimeRef.current = null;
      return;
    }
    
    let raf = 0;
    const initialValue = 0;
    
    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / duration);
      
      // Ease out cubic
      const progress = 1 - Math.pow(1 - t, 3);
      const currentTarget = targetRef.current;
      
      setValue(initialValue + currentTarget * progress);
      
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(currentTarget);
      }
    };
    
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, duration]);
  return value;
}
