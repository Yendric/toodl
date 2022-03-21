import CSSTransition from "react-transition-group/CSSTransition";
import { FC } from "react";
import { Container } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Fade: FC<any> = ({ timeout, children, ...props }) => (
  <Container>
    <CSSTransition timeout={timeout} classNames={"fade"} {...props}>
      {children}
    </CSSTransition>
  </Container>
);

export default Fade;
