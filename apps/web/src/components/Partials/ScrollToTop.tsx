import { useEffect, type FC } from "react";
import { useLocation } from "react-router";

const ScrollToTop: FC = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <></>;
};

export default ScrollToTop;
