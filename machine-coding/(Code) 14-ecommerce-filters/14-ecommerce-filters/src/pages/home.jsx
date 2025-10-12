import {useMemo, useState} from "react";
import {ShoppingCartState} from "../context/context";
import Pagination from "../components/pagination";
import StarRating from "../components/star-rating";
import Filters from "../components/filters";

const Home = () => {
  const [page, setPage] = useState(1);

  const {
    state: {products},
    filterState: {sort, byStock, byRating, searchQuery},
  } = ShoppingCartState();

  const filteredProducts = useMemo(() => {
    let filteredProducts = products;

    if (sort) {
      filteredProducts = filteredProducts.sort((a, b) => {
        return sort === "lowToHigh" ? a.price - b.price : b.price - a.price;
      });
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
        prod.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setPage(1);

    return filteredProducts;
  }, [sort, byStock, byRating, searchQuery, products]);

  console.log(filteredProducts);

  return (
    <div>
      <div className="py-9 flex">
        {/* Filters */}
        <Filters />
        {/* Products */}
        {filteredProducts.length > 0 && (
          <div className="products w-full">
            {filteredProducts?.slice(page * 10 - 10, page * 10).map((prod) => {
              return (
                <span className={`products__single`} key={prod.id}>
                  <img src={prod.thumbnail} alt={prod.title} />
                  <span>{prod.title}</span>
                  <hr />
                  <span>$ {prod.price}</span>
                  <StarRating rating={prod.rating} />
                </span>
              );
            })}
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <Pagination products={filteredProducts} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default Home;
