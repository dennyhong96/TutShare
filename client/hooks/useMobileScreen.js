import { useState, useEffect } from "react";

const useMobileScreen = (screenWidth = 576) => {
  const [isMobile, setIsMobile] = useState(
    process.browser ? !!(window.innerWidth <= screenWidth) : false
  );

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < screenWidth) {
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
