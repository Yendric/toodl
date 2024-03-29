import ReactDOM from "react-dom/client";
import App from "./App";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
