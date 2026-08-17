import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "~/src/components/Navbar";
import { Home } from "~/src/pages/Home";
import { ProductDetail } from "~/src/pages/ProductDetail";
import "./index.css";
import { ThemeProvider } from "~/src/theme/ThemeProvider";
import '@fontsource/darker-grotesque/400.css';
import '@fontsource/darker-grotesque/600.css';
import '@fontsource-variable/playfair';

export function App() {
  return (
    <>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}