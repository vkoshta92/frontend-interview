import React from "react";

async function getProducts() {
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function ProductsServer() {
  const {products} = await getProducts();

  return (
    <div>
      <h1>Products</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsServer;
