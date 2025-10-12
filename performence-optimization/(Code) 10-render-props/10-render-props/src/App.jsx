import ToggleableContent from "./components/toggleable-content";

const App = () => {
  return (
    <div>
      <h1>Render Props</h1>
      <ToggleableContent
        render={({isOpen, toggle}) => {
          return (
            <div>
              <button onClick={toggle}>
                {isOpen ? "Hide" : "Show"} Content
              </button>
              {isOpen && <p>Subscribe to Roadside Coder!</p>}
            </div>
          );
        }}
      />
    </div>
  );
};

export default App;
