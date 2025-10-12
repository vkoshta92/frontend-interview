import StarRating from "../components/star-rating";
import {ShoppingCartState} from "../context/context";

const Cart = () => {
  const {
    dispatch,
    state: {cart},
  } = ShoppingCartState();

  return (
    <div className="py-9 flex flex-col gap-5 col-span-2">
      <div className="text-2xl text-center ">
        Sub-total: ${cart.reduce((acc, curr) => acc + curr.price, 0)}
      </div>
      {cart.map((prod) => {
        const inCart = cart.some((p) => p.id === prod.id);

        return (
          <span
            key={prod.id}
            className="flex h-36 items-center justify-between border-2 p-5"
          >
            <img
              src={prod.thumbnail}
              alt={prod.title}
              className="h-full w-48 object-contain"
            />
            <div className="flex flex-col">
              <span>{prod.title}</span>
              <span>$ {prod.price}</span>
            </div>
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
  );
};

export default Cart;
