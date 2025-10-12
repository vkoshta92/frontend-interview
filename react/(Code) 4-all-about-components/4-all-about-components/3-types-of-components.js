function App() {
  return (
    <div>
      <h2>Different Types of Components</h2>
      <h5>Question 1: What are Smart / Stateful / Container Components?</h5>
      {/* 
        Manages state, handles business logic, and passes data down to presentational 
        components.
      */}

      <h5>
        Question 2: What are Dumb / Stateless / Presentational Components?
      </h5>
      {/*
        - Only renders UI based on the props it receives.
        - Doesn't have its own state or lifecycle methods.
      */}

      <h5>Question 3: What are Higher Order Component (HOC)?</h5>
      {/* 
       - Function that takes a component and returns a new enhanced component.
       - Used for code reuse, logic sharing, and adding additional functionalities to 
       components.
      */}
      <FeatureWithAuth />
      <EnhancedFeatureFn />

      <h5>Question 4: What are Pure Components?</h5>
      {/* 
       - Optimize the rendering performance of components by reducing unnecessary re-renders
      */}
      <Counter />

      <h5>Question 5: What are Controlled Component?</h5>
      {/* 
       - Value of the input field is controlled by React through state.
      */}
      <ControlledInput />

      <h5>Question 6: What are Un-Controlled Component?</h5>
      {/* 
       - Input field maintains its own state using the DOM. 
       - React doesn’t control the value, but it can still interact with the input using refs.
      */}
      <UnControlledInput />
    </div>
  );
}

const UnControlledInput = () => {
  const inputRef = React.useRef(null);

  function handleClick() {
    console.log(inputRef?.current?.value);
  }

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleClick}>Get Value</button>
    </div>
  );
};

const ControlledInput = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // input -> state -> input -> state

  return (
    <div>
      <input type="text" value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </div>
  );
};

const Counter = () => {
  const [count, setCount] = React.useState(0);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment</button>
      <MemoizedComponentClass />
      <MemoizedComponentFn />
    </div>
  );
};

class MemoizedComponentClass extends React.PureComponent {
  render() {
    console.log("class component rerendered");
    return <div>Pure Class Component</div>;
  }
}

const MemoizedComponentFn = React.memo(() => {
  console.log("Fn Component rerender");
  return <div>Pure Fn Component</div>;
});

const withLoginFn = (WrappedComponent) => {
  return () => {
    function login() {
      // login logic
      console.log("Login Successful");
    }

    function logout() {
      // logout logic
      console.log("Logout Successfull");
    }

    return <WrappedComponent login={login} logout={logout} />;
  };
};

function FeatureComponentFn(props) {
  return (
    <div>
      <button onClick={() => props.login()}>Login</button>
      <button onClick={() => props.logout()}>Logout</button>
    </div>
  );
}

const EnhancedFeatureFn = withLoginFn(FeatureComponentFn);

const withLogin = (WrappedComponent) => {
  return class extends React.Component {
    login() {
      // login logic
      console.log("Login Successful");
    }

    logout() {
      // logout logic
      console.log("Logout Successfull");
    }

    render() {
      return <WrappedComponent login={this.login} logout={this.logout} />;
    }
  };
};

class FeatureComponent extends React.Component {
  render() {
    return (
      <div>
        <button onClick={() => this.props.login()}>Login</button>
        <button onClick={() => this.props.logout()}>Logout</button>
      </div>
    );
  }
}

const FeatureWithAuth = withLogin(FeatureComponent);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
