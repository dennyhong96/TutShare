import { useState, useEffect } from "react";

const useMobileScreen = () => {
  const [isMobile, setIsMobile] = useState(
    process.browser ? !!(window.innerWidth <= 576) : false
  );

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 576) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    if (process.browser) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [process.browser]);

  return {
    isMobile,
  };
};

export default useMobileScreen;
