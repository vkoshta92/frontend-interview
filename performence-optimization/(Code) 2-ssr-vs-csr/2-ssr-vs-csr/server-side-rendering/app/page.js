import Image from "next/image";
import styles from "./page.module.css";
import Products from "@/components/products";
import ProductsServer from "@/components/products-server";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <Products /> */}
      <ProductsServer />
    </main>
  );
}
