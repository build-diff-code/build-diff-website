import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { products } from "~/src/data/products";
import styles from "./ProductDetail.module.css";

const TOTAL = products.length;

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const index = products.findIndex((p: (typeof products)[number]) => p.slug === slug);
  const product = products[index];

  if (!product) {
    return (
      <div className={styles.wrap}>
        <p>Product not found.</p>
        <Link to="/">← Back to canvas</Link>
      </div>
    );
  }

  const prevSlug = products[index === 0 ? TOTAL - 1 : index - 1].slug;
  const nextSlug = products[index === TOTAL - 1 ? 0 : index + 1].slug;

  return (
    <div className={styles.wrap}>
      <div className={styles.layout}>
        <motion.div
          className={styles.imageWrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            className={styles.image}
            src={`/${product.url}`}
            alt={product.name}
            width={product.width}
            height={product.height}
          />
        </motion.div>

        <div className={styles.info}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
            className={styles.title}
          >
            {product.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
          >
            <p className={styles.price}>{product.client}</p>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.ctaRow}>
              <button className={styles.cta}>know more →</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <div className={styles.rule} />
            <div className={styles.navRow}>
              <span className={styles.count}>
                {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
              </span>
              <div className={styles.navBtns}>
                <button onClick={() => navigate(`/product/${prevSlug}`)} className={styles.navBtn}>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M0 4H13M0 4L4 1M0 4L4 7" stroke="currentColor" strokeWidth="0.8" />
                  </svg>
                  Prev
                </button>
                <button onClick={() => navigate(`/product/${nextSlug}`)} className={styles.navBtn}>
                  Next
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M0 4H13M13 4L9 1M13 4L9 7" stroke="currentColor" strokeWidth="0.8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}