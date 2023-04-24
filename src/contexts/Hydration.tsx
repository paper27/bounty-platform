/* eslint-disable */
import { useState, useEffect } from "react";

// ref: https://github.com/vercel/next.js/discussions/35773#discussioncomment-3941192
const Hydration = ({ children }: { children?: any }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHydrated(true);
    }
  }, []);
  return hydrated ? children : <></>;
};

export default Hydration;
