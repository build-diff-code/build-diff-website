import * as React from "react";
import type { MediaItem } from "~/src/data/media";
import { useTheme } from "~/src/theme/ThemeProvider";
import { InfiniteScene } from "./InfiniteScene";
import styles from "./style.module.css";

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
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new InfiniteScene<T>(canvasRef.current, items, onItemClick, theme);
    sceneRef.current = scene;

    return () => {
      sceneRef.current = null;
      scene.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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