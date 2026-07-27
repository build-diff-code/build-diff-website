import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "~/src/components/Navbar";
import { Home } from "~/src/pages/Home";
import { ProductDetail } from "~/src/pages/ProductDetail";
import { WhatWeLike } from "~/src/pages/WhatWeLike";
import "./index.css";
import { ThemeProvider } from "~/src/theme/ThemeProvider";

export function App() {
  return (
    <>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/what-we-like" element={<WhatWeLike />} />
          <Route path="/jams" element={<Navigate to="/what-we-like" replace />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}