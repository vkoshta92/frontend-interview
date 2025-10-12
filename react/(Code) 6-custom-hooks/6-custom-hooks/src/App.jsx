import "./App.css";
import Counter from "./components/counter";
import WindowDimensions from "./components/window-dimensions";
import PostList from "./components/post-lists";
import DebouncedInput from "./components/debounced-input";
import UserInfo from "./components/user-info";
import IntersectionElement from "./components/intersection-element";

function App() {
  return (
    <div>
      <h2>Custom Hooks Interview Questions in React</h2>

      <h4>
        <u>Question 0: What are Custom Hooks?</u>
      </h4>
      <p>
        Custom hooks in React are functions that allow you to extract and reuse
        stateful logic from components.
      </p>

      <h4>
        <u>
          Question 1: Build a Custom hook to manage and update a counter with
          appropriate functionalities.
        </u>
      </h4>
      {/*
        const {count, increment, decrement, reset} = useCounter(0, 2); 
      */}
      <Counter />

      <h4>
        <u>
          Question 2: Build a Custom hook to efficiently track and update window
          dimensions dynamically.
        </u>
      </h4>
      {/* 
        const {width, height} = useWindowSize(); 
      */}
      <WindowDimensions />

      <h4>
        <u>
          Question 3: Build a Custom hook to fetch data from a given URL and
          handle loading and error states as well.
        </u>
      </h4>
      {/* 
        const {data, loading, error} = useFetch("https://jsonplaceholder.typicode.com/posts"); 
      */}
      <PostList />

      <h4>
        <u>
          Question 4: Build a Custom hook that delays updating a value until a
          specified time has passed after the last change ?
        </u>
      </h4>
      <DebouncedInput />

      <h4>
        <u>
          Question 5: Build a Custom hook that stores and retrieves data from
          the browser localStorage.
        </u>
      </h4>
      <UserInfo />

      <h4>
        <u>
          Question 6: Build a Custom hook that observes when an element comes
          into the viewport.
        </u>
      </h4>
      <IntersectionElement />
    </div>
  );
}

export default App;
