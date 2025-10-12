// 1 - Render Phase
// 2 - Commit Phase

function Counter() {
  const [count, setCount] = React.useState(0);
  // let count1 = 0;
  // let message = "hello" + count;

  const increment = () => {
    setCount((prevValue) => prevValue + 1);
    setCount((prevValue) => prevValue + 1);
    setCount((prevValue) => prevValue + 1);
    setCount((prevValue) => prevValue + 1);
    setCount((prevValue) => prevValue + 1);
    // setCount(count + 1);
    // setCount(count + 1);
    // setCount(count + 1);
    // setCount(count + 1);
    // count1 = count1 + 1;
  };
  console.log("Count Rendered");

  // const counter = React.createElement(
  //   "div",
  //   null,
  //   React.createElement("p", null, `Count: ${count}`),
  //   React.createElement("button", {onClick: increment}, `Increment`)
  // );
  // return counter;

  return (
    <div>
      <p>Count: {count}</p>
      {/* <p>Count: {count1}</p> */}
      <button onClick={increment}>Increment</button>
    </div>
  );
}

const CounterParent = () => {
  const [showMessage, setShowMessage] = React.useState(false);
  const [showMessage2, setShowMessage2] = React.useState(false);

  const [toggleCount, setToggleCount] = React.useState(false);

  console.log("Parent Rendered");

  const toggleMessages = () => {
    setShowMessage(!showMessage);
    setShowMessage2(!showMessage2);
  };

  return (
    <div>
      {toggleCount ? (
        <div>
          <h1>Counter</h1>
          <Counter />
        </div>
      ) : (
        <span>
          <p>Counter off</p>
        </span>
      )}
      <button onClick={() => setToggleCount(!toggleCount)}>
        Toggle Counter
      </button>
      <br />
      {showMessage && <b>Now you see me</b>}
      {showMessage2 && <b>Now you see me Again</b>}
      <button onClick={toggleMessages}>Show Message</button>
      <br />
      <Frameworks />
    </div>
  );
};

const Frameworks = () => {
  const [frameworks, setFrameworks] = React.useState([
    {id: 166, name: "React"},
    {id: 321, name: "Angular"},
  ]);

  return (
    <div>
      <h3>Popular Frameworks</h3>
      <div>
        {frameworks.map((item, index) => (
          <p key={item.id}>{item.name}</p>
        ))}
      </div>
      <button
        onClick={() => setFrameworks([{id: 888, name: "Vue"}, ...frameworks])}
      >
        Add New
      </button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(CounterParent));
