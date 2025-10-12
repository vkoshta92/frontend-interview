import "./App.css";

function App() {
  return (
    <div>
      <h2>Redux Interview Questions in React</h2>

      <h4>
        <u>Question 1: What is Redux?</u>
      </h4>
      <p>
        Redux is a state management library often used with React. It helps in
        managing the application state in a predictable way by centralizing the
        state in a single store, enabling easy debugging and testing.
      </p>

      <h4>
        <u>Question 2: How does the redux state management works?</u>
      </h4>

      <h4>
        <u>Question 3: How do you define an action in Redux?</u>
      </h4>

      <h4>
        <u>Question 4: What is a reducer in Redux? Show an example?</u>
      </h4>

      <h4>
        <u>Question 5: How do you create a Redux store?</u>
      </h4>

      <h4>
        <u>
          Question 6: What is redux-thunk middleware in Redux and how do you
          apply it?
        </u>
      </h4>
      <h4>
        <u>
          Question 6: When would you choose Context API over Redux, and vice
          versa?
        </u>
      </h4>
    </div>
  );
}

const incrementAction = {
  type: "INCREMENT",
  payload: "data",
};

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

export default App;
