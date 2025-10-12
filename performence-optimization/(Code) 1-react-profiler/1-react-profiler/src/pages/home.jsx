import {useMemo, useState} from "react";
import "./styles.css";
import Pagination from "../components/pagination";
import StarRating from "../components/star-rating";

import {ShoppingCartState} from "../context/context";
import Filters from "../components/filters";

function Home() {
  const [page, setPage] = useState(1);

  const {
    dispatch,
    state: {products, cart},
    filterState: {sort, byStock, byRating, searchQuery},
  } = ShoppingCartState();

  const filteredProducts = useMemo(() => {
    let filteredProducts = products;
    // for (let i = 0; i < 1000000000; i++) {
    //   // slow code
    // }

    if (sort) {
      filteredProducts = filteredProducts.sort((a, b) =>
        sort === "lowToHigh" ? a.price - b.price : b.price - a.price
      );
    }

    if (!byStock) {
      filteredProducts = filteredProducts.filter((prod) => prod.inStock);
    }

    if (byRating) {
      filteredProducts = filteredProducts.filter(
        (prod) => prod.rating >= byRating
      );
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((prod) =>
        prod.title.toLowerCase().includes(searchQuery)
      );
    }

    setPage(1);

    return filteredProducts;
  }, [sort, byStock, byRating, searchQuery, products]);

  return (
    <div>
      <div className="py-9 flex">
        <Filters />
        {filteredProducts.length > 0 && (
          <div className="products w-full">
            {filteredProducts.slice(page * 10 - 10, page * 10).map((prod) => {
              const inCart = cart.some((p) => p.id === prod.id);

              return (
                <span className={`products__single`} key={prod.id}>
                  <img src={prod.thumbnail} alt={prod.title} />
                  <span>{prod.title}</span>
                  <hr />
                  <span>$ {prod.price}</span>
                  <StarRating rating={prod.rating} />
                  <button
                    className="disabled:opacity-50"
                    style={{
                      padding: "5px 10px",
                      marginTop: 10,
                      background: inCart ? "orange" : "lightblue",
                      border: "none",
                      borderRadius: 2,
                    }}
                    disabled={!prod.inStock}
                    onClick={() =>
                      dispatch({
                        type: inCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
                        payload: prod,
                      })
                    }
                  >
                    {prod.inStock
                      ? inCart
                        ? "Remove from Cart"
                        : "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {products.length > 0 && (
        <Pagination products={filteredProducts} page={page} setPage={setPage} />
      )}
    </div>
  );
}

export default Home;
