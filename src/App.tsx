import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "~/src/components/Navbar";
import { Home } from "~/src/pages/Home";
import { ProductDetail } from "~/src/pages/ProductDetail";
<<<<<<< HEAD
=======
import { WhatWeLike } from "~/src/pages/WhatWeLike";
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
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
<<<<<<< HEAD
=======
          <Route path="/what-we-like" element={<WhatWeLike />} />
          <Route path="/jams" element={<Navigate to="/what-we-like" replace />} />
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
        </Routes>
      </ThemeProvider>
    </>
  );
}