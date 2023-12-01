import React from "react";
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { baseTheme } from './styles/theme';
import FontStyles from './styles/fontStyles';
import GlobalStyles from "./styles/globalStyles";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={baseTheme}>
      <FontStyles />
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
