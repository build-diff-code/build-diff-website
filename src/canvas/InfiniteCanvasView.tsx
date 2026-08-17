import * as React from "react";
import type { Product } from "~/src/data/products";
import { useTheme } from "~/src/theme/ThemeProvider";
import { InfiniteScene } from "./InfiniteScene";
import styles from "./style.module.css";

type InfiniteCanvasViewProps = {
  items: Product[];
  onItemClick?: (slug: string) => void;
};

export function InfiniteCanvasView({
  items,
  onItemClick,
}: InfiniteCanvasViewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const sceneRef = React.useRef<InfiniteScene | null>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new InfiniteScene(
      canvasRef.current,
      items,
      onItemClick,
      theme,
    );

    sceneRef.current = scene;

    return () => {
      sceneRef.current = null;
      scene.dispose();
    };
  }, [items, onItemClick]);

  React.useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  return (
    <div className={styles.canvasWrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}