"use client";

import React, {useState, useEffect} from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setIsLoading(false);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.title} - ${product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;
