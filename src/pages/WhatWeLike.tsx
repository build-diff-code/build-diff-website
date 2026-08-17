import { InfiniteCanvasView } from "~/src/canvas/InfiniteCanvasView";
import { jams } from "~/src/data/music";
import styles from "./Home.module.css";

export function WhatWeLike() {
  return (
    <>
      <InfiniteCanvasView items={jams} />
      <header className={styles.frame}>
        <img
          src="/assets/logo_wordmark.png"
          alt="Brand logo"
          draggable={false}
          className={styles.logo}
        />
        <p className={styles.hint}>Drag to explore · Scroll or pinch to zoom</p>
      </header>
    </>
  );
}