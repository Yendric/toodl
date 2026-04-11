import { type FC } from "react";
import { Outlet } from "react-router";
import ScrollToTop from "../components/Partials/ScrollToTop";

const Root: FC = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default Root;
