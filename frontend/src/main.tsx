import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App";

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider
    theme={theme}
    defaultColorScheme="dark"
  >
    <App />
  </MantineProvider>
);