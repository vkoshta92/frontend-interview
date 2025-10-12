function App() {
  return (
    <div>
      <h2>State vs Props Interview Questions</h2>
      <h5>
        Question 1: Explain state vs props in both class and functional
        components
      </h5>
      {/* 
      Props -
       - Read-only data passed from a parent component to a child component.
       - Immutable and are used to communicate between components.
      */}
      <ParentComponent />
      {/* 
      State 
       - Mutable and represents the internal state of a component.
       - Managed and controlled within the component itself.
      */}
      {/* 
      Difference:
      - Props are immutable data passed down from parent components.
      - State is mutable and represents the internal state of a component. 
      - In class components, `this.props` and `this.state` are used to access props and state
       respectively. 
      - In functional components, props are passed as an argument to the component function,
        and state is managed using hooks like `useState`.
      */}

      <h5>Question 2: What is children prop?</h5>
      <Card>
        <b>This is card 1</b>
      </Card>
      <Card>This is card 2</Card>
    </div>
  );
}

const Card = (props) => {
  // logic
  return (
    <div style={{color: "orangered"}}>
      <p>card title</p>
      {props.children}
    </div>
  );
};

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  incrementCount = () => {
    this.setState({count: this.state.count + 1});
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.incrementCount}>Increment</button>
      </div>
    );
  }
}

const CounterFn = () => {
  const [count, setCount] = React.useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment</button>
    </div>
  );
};

const ChildComponentFn = ({name, age}) => {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};

// Parent Component
class ParentComponent extends React.Component {
  render() {
    return <ChildComponentFn name="John" age={25} />;
  }
}

// Child Component
class ChildComponent extends React.Component {
  render() {
    const {name, age} = this.props;
    return (
      <div>
        <p>Name: {name}</p>
        <p>Age: {age}</p>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
