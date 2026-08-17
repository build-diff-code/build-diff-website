import * as React from "react";
<<<<<<< HEAD
import type { Product } from "~/src/data/products";
=======
import type { MediaItem } from "~/src/data/media";
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
import { useTheme } from "~/src/theme/ThemeProvider";
import { InfiniteScene } from "./InfiniteScene";
import styles from "./style.module.css";

<<<<<<< HEAD
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
=======
type InfiniteCanvasViewProps<T extends MediaItem> = {
  items: T[];
  /** Called with the clicked item's slug. Omit to make items unclickable. */
  onItemClick?: (slug: string) => void;
};

export function InfiniteCanvasView<T extends MediaItem>({
  items,
  onItemClick,
}: InfiniteCanvasViewProps<T>) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const sceneRef = React.useRef<InfiniteScene<T> | null>(null);
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!canvasRef.current) return;

<<<<<<< HEAD
    const scene = new InfiniteScene(
      canvasRef.current,
      items,
      onItemClick,
      theme,
    );

=======
    const scene = new InfiniteScene<T>(canvasRef.current, items, onItemClick, theme);
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
    sceneRef.current = scene;

    return () => {
      sceneRef.current = null;
      scene.dispose();
    };
<<<<<<< HEAD
=======
    // eslint-disable-next-line react-hooks/exhaustive-deps
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
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