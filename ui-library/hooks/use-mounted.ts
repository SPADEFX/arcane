import { useState, useEffect } from "react";

/** Returns true after first client-side render. Useful for SSR hydration guards. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
