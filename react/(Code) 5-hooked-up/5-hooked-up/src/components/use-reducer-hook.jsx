import {useReducer} from "react";

const UseReducerHook = () => {
  const countReducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          count: state.count + 1,
        };
      case "DECREMENT":
        return {
          ...state,
          count: state.count - 1,
        };

      default:
        return state;
    }
  };

  const initialCount = {
    count: 0,
  };

  const [state, dispatch] = useReducer(countReducer, initialCount);

  return (
    <div>
      <h3>
        <u>useReducer Hook</u>
      </h3>

      <h5>Question 1: What is useReducer in React?</h5>
      {/*
        - It is a hook used for managing complex state logic by utilizing a reducer function. 
        - Alternative to useState and provides a way to update state based on defined actions.
      */}
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({type: "INCREMENT"})}>Increment</button>
      <button onClick={() => dispatch({type: "DECREMENT"})}>Decrement</button>

      <h5>Question 2: When should you use useReducer instead of useState?</h5>
      {/* 
        - When managing complex state transitions or logic that involves multiple sub-values.
        - When state logic follows a pattern or when multiple actions need to update the state
        in predictable ways.
      */}

      <h5>
        Question 3: Give Example of useReducer for Shopping Cart State
        Management?
      </h5>
      <ShoppingCart />
    </div>
  );
};

const initialState = {
  cart: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    default:
      break;
  }
};

const products = [
  {id: 1, name: "Product 1"},
  {id: 2, name: "Product 2"},
  {id: 3, name: "Product 3"},
];

const ShoppingCart = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <div>
      <ul>
        {state.cart.map((item) => (
          <li key={item.id}>
            {item.name}{" "}
            <button
              onClick={() => dispatch({type: "REMOVE_ITEM", payload: item})}
            >
              Remove from Cart
            </button>
          </li>
        ))}
      </ul>

      {products.map((prod) => (
        <button
          key={prod.id}
          onClick={() => dispatch({type: "ADD_ITEM", payload: prod})}
        >
          {prod.name}
        </button>
      ))}
      <button onClick={() => dispatch({type: "CLEAR_CART"})}>Clear Cart</button>
    </div>
  );
};

export default UseReducerHook;
