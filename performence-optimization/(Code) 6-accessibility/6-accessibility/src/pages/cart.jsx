import StarRating from "../components/star-rating";
import {ShoppingCartState} from "../context/context";

const Cart = () => {
  const {
    dispatch,
    state: {cart},
  } = ShoppingCartState();

  return (
    <div className="py-9 flex flex-col gap-5">
      <div className="text-2xl text-center">
        Sub-total: ${cart.reduce((acc, curr) => acc + curr.price, 0)}
      </div>
      {cart.map((prod) => {
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
            {/* add change cart quantity */}
            <button
              className={`px-2 py-1 mt-2 bg-blue-400 text-white border-none rounded-sm disabled:opacity-50`}
              disabled={!prod.inStock}
              onClick={() =>
                dispatch({
                  type: "REMOVE_FROM_CART",
                  payload: prod,
                })
              }
            >
              Remove from Cart
            </button>
          </span>
        );
      })}
    </div>
  );
};

export default Cart;
