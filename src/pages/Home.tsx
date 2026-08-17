import { useNavigate } from "react-router-dom";
import { InfiniteCanvasView } from "~/src/canvas/InfiniteCanvasView";
import { products } from "~/src/data/products";
import styles from "./Home.module.css";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <InfiniteCanvasView
        items={products}
        onItemClick={(slug) => navigate(`/product/${slug}`)}
      />
      <header className={styles.frame}>
        <img
          src="/assets/logo_wordmark.png"
          alt="Brand logo"
          draggable={false}
          className={styles.logo}
        />
        <p className={styles.hint}>Drag to explore · Scroll or pinch to zoom · Click a product</p>
      </header>
    </>
  );
}