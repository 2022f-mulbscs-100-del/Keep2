import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [size, setSize] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleSize = () => {
      const width = window.innerWidth;
      setSize(width);

      setIsMobile(width < 480);
      setIsTablet(width >= 480 && width < 768);
      setIsDesktop(width >= 768);
    };

    handleSize(); // set initial valuesw
    window.addEventListener("resize", handleSize);

    return () => window.removeEventListener("resize", handleSize);
  }, []);

  return {
    size,
    isMobile,
    isTablet,
    isDesktop,
  };
};
