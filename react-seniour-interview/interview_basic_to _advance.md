# ⚛️ React JS — 4 Saal Ka Complete Roadmap (Hinglish)
> Junior se Lead tak — Company Work ke saath Real Examples

---

# 📅 YEAR 1 — Foundation (Junior)

---

## Y1.1 — React Kya Hai?

```
React = Facebook ka UI library
Component-based hai — UI ko pieces mein tod do
Virtual DOM use karta hai — fast updates

Normal HTML:
Poora page reload hota tha

React:
Sirf woh part update hota hai jo badla!
= FAST ⚡
```

### Setup
```bash
# New project banao
npx create-react-app my-app
cd my-app
npm start

# Ya Vite se (faster)
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

### Folder Structure
```
src/
├── App.jsx           ← Root component
├── main.jsx          ← Entry point
├── components/       ← Reusable components
│   ├── Button.jsx
│   └── Header.jsx
├── pages/            ← Page components
│   ├── Home.jsx
│   └── About.jsx
├── hooks/            ← Custom hooks
├── context/          ← Global state
├── services/         ← API calls
└── utils/            ← Helper functions
```

---

## Y1.2 — Components

### Functional Component (Modern way)
```jsx
// Simple component
function Welcome() {
  return (
    <div>
      <h1>Hello Vishnu!</h1>
      <p>React seekh rahe ho 😊</p>
    </div>
  );
}

export default Welcome;

// Arrow function style
const Welcome = () => {
  return <h1>Hello!</h1>;
};

// Single line
const Welcome = () => <h1>Hello!</h1>;
```

### JSX Rules
```jsx
// JSX = JavaScript + HTML mixed

// Rule 1: Ek parent element hona chahiye
// ❌ Wrong
return (
  <h1>Title</h1>
  <p>Para</p>
);

// ✅ Correct — div ya Fragment use karo
return (
  <div>
    <h1>Title</h1>
    <p>Para</p>
  </div>
);

// Fragment — extra div nahi aayega DOM mein
return (
  <>
    <h1>Title</h1>
    <p>Para</p>
  </>
);

// Rule 2: className use karo (class nahi)
<div className="container">

// Rule 3: camelCase attributes
<input onChange={handler} />
<div onClick={clickHandler} />

// Rule 4: {} mein JavaScript likhte hain
const name = 'Vishnu';
return <h1>Hello {name}!</h1>;
return <h1>{2 + 2}</h1>; // 4
return <h1>{isLoggedIn ? 'Hi!' : 'Login karo'}</h1>;
```

---

## Y1.3 — Props

```jsx
// Props = parent se child ko data bhejo
// Props = Read only — change mat karo!

// Parent component
function App() {
  return (
    <div>
      <UserCard
        name="Vishnu"
        age={25}
        isActive={true}
        skills={['React', 'PixiJS']}
      />
    </div>
  );
}

// Child component — props receive karo
function UserCard({ name, age, isActive, skills }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {isActive ? '🟢 Active' : '🔴 Inactive'}</p>
      <ul>
        {skills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

// Default props
function Button({ text = 'Click', color = 'blue' }) {
  return <button style={{ background: color }}>{text}</button>;
}

// Children prop
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
<Card title="My Card">
  <p>Yeh children hai!</p>
  <button>Click me</button>
</Card>
```

---

## Y1.4 — State (useState)

```jsx
import { useState } from 'react';

// State = Component ka apna data
// State change hone pe component re-render hota hai

function Counter() {
  // [value, setValue] = useState(initialValue)
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Multiple states
function LoginForm() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAPI(email, password);
    } catch(err) {
      setError('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}

// Object state
function Profile() {
  const [user, setUser] = useState({
    name:  'Vishnu',
    age:   25,
    email: 'vishnu@email.com'
  });

  const updateName = (newName) => {
    // ❌ Direct modify mat karo!
    // user.name = newName; // BUG!

    // ✅ Spread karo — new object banao
    setUser({ ...user, name: newName });
  };

  return (
    <div>
      <h1>{user.name}</h1>
      <input
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
      />
    </div>
  );
}
```

---

## Y1.5 — useEffect

```jsx
import { useState, useEffect } from 'react';

// useEffect = Side effects handle karo
// Side effects = API calls, timers, subscriptions

function UserProfile({ userId }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // [] = sirf ek baar run hoga (component mount pe)
  useEffect(() => {
    fetchUser(userId);
  }, []);

  // [userId] = userId change hone pe run hoga
  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/${userId}`)
      .then(res  => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]); // Dependency array

  // Cleanup — component unmount pe
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer running');
    }, 1000);

    // Cleanup function — return karo
    return () => {
      clearInterval(timer); // Timer band karo
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user)   return <p>User not found</p>;

  return <h1>{user.name}</h1>;
}

// Real company example — Product list
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res  = await fetch('https://api.example.com/products');
        const data = await res.json();
        setProducts(data);
      } catch(err) {
        setError('Products load nahi hue!');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Y1.6 — Event Handling

```jsx
function EventExamples() {
  // Click
  const handleClick = () => alert('Clicked!');

  // With parameter
  const handleItemClick = (id) => {
    console.log('Item clicked:', id);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Page reload rokta hai
    console.log('Form submitted!');
  };

  // Input change
  const [value, setValue] = useState('');
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
      <button onClick={() => handleItemClick(5)}>Item 5</button>

      <form onSubmit={handleSubmit}>
        <input
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```

---

## Y1.7 — Lists & Conditional Rendering

```jsx
function ListExample() {
  const items = ['React', 'PixiJS', 'Node.js', 'MongoDB'];
  const [show, setShow] = useState(true);

  return (
    <div>
      {/* Conditional rendering */}
      {show && <p>Yeh dikh raha hai!</p>}
      {show ? <p>Show hai</p> : <p>Hide hai</p>}

      {/* List render */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
          // key COMPULSORY hai — React tracking ke liye
        ))}
      </ul>

      {/* Objects ki list */}
      {users.map(user => (
        <UserCard
          key={user.id}  // id use karo index nahi
          name={user.name}
          email={user.email}
        />
      ))}
    </div>
  );
}
```

---

# 📅 YEAR 2 — Intermediate (Mid Level)

---

## Y2.1 — Hooks Deep Dive

### useRef
```jsx
import { useRef } from 'react';

function RefExample() {
  // useRef = DOM element ya value hold karo
  // Re-render trigger NAHI karta

  // DOM element access
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // Direct DOM access
  };

  // Value hold karo (re-render nahi)
  const countRef = useRef(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      countRef.current++; // State nahi — re-render nahi
      console.log(countRef.current);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Type here" />
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

### useCallback
```jsx
import { useState, useCallback } from 'react';

// useCallback = function ko memoize karo
// Har render pe naya function nahi banega

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName]   = useState('');

  // ❌ Without useCallback — har render pe naya function
  const handleClick = () => {
    console.log('Clicked!');
  };

  // ✅ With useCallback — sirf jab dependency change ho
  const handleClick = useCallback(() => {
    console.log('Clicked!', count);
  }, [count]); // count change hone pe naya function

  return (
    <div>
      <input onChange={(e) => setName(e.target.value)} />
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}
```

### useMemo
```jsx
import { useState, useMemo } from 'react';

// useMemo = expensive calculation memoize karo

function ProductList({ products, filter }) {
  // ❌ Har render pe filter calculate hoga
  const filtered = products.filter(p => p.category === filter);

  // ✅ Sirf jab products ya filter change ho
  const filteredProducts = useMemo(() => {
    console.log('Filtering...'); // Sirf jab zarurat ho
    return products
      .filter(p => p.category === filter)
      .sort((a, b) => b.price - a.price);
  }, [products, filter]); // Dependencies

  return (
    <div>
      {filteredProducts.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

### useReducer
```jsx
import { useReducer } from 'react';

// useReducer = complex state management
// Redux jaisa — action → reducer → new state

// Action types
const ACTIONS = {
  SPIN:          'SPIN',
  SPIN_COMPLETE: 'SPIN_COMPLETE',
  WIN:           'WIN',
  UPDATE_BET:    'UPDATE_BET',
};

// Reducer function
function gameReducer(state, action) {
  switch(action.type) {
    case ACTIONS.SPIN:
      return {
        ...state,
        isSpinning: true,
        balance:    state.balance - state.bet,
      };

    case ACTIONS.SPIN_COMPLETE:
      return {
        ...state,
        isSpinning: false,
        symbols:    action.payload.symbols,
      };

    case ACTIONS.WIN:
      return {
        ...state,
        balance:   state.balance + action.payload.amount,
        lastWin:   action.payload.amount,
      };

    case ACTIONS.UPDATE_BET:
      return { ...state, bet: action.payload };

    default:
      return state;
  }
}

// Initial state
const initialState = {
  balance:    1000,
  bet:        10,
  isSpinning: false,
  symbols:    [],
  lastWin:    0,
};

function SlotGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const spin = async () => {
    dispatch({ type: ACTIONS.SPIN });

    const result = await serverAPI.spin({ bet: state.bet });

    dispatch({ type: ACTIONS.SPIN_COMPLETE, payload: result });

    if (result.totalWin > 0) {
      dispatch({ type: ACTIONS.WIN, payload: { amount: result.totalWin } });
    }
  };

  return (
    <div>
      <p>Balance: {state.balance}</p>
      <p>Last Win: {state.lastWin}</p>
      <button
        onClick={spin}
        disabled={state.isSpinning}
      >
        {state.isSpinning ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );
}
```

---

## Y2.2 — Custom Hooks

```jsx
// Custom hook = reusable logic
// hamesha "use" se start karo

// 1. useFetch — API call ka hook
function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res  = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage — kitna clean hai!
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <Spinner />;
  if (error)   return <Error message={error} />;

  return users.map(u => <UserCard key={u.id} user={u} />);
}

// 2. useLocalStorage — localStorage hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

// Usage
function Settings() {
  const [theme,  setTheme]  = useLocalStorage('theme', 'dark');
  const [volume, setVolume] = useLocalStorage('volume', 0.8);

  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme: {theme}
      </button>
      <input
        type="range" min="0" max="1" step="0.1"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  );
}

// 3. useDebounce — Search ke liye
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // Cleanup!
  }, [value, delay]);

  return debouncedValue;
}

// Usage — search mein har keystroke pe API call nahi
function SearchBox() {
  const [query,  setQuery]  = useState('');
  const debounced           = useDebounce(query, 500);
  const { data: results }   = useFetch(`/api/search?q=${debounced}`);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results?.map(r => <ResultItem key={r.id} item={r} />)}
    </div>
  );
}
```

---

## Y2.3 — Context API (Global State)

```jsx
import { createContext, useContext, useState, useReducer } from 'react';

// Context = Global state — props drilling se bachao

// 1. Context create karo
const AuthContext = createContext(null);

// 2. Provider banao
function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);
      localStorage.setItem('token', userData.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook banao
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}

// 4. App mein wrap karo
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes />
      </Router>
    </AuthProvider>
  );
}

// 5. Kisi bhi component mein use karo
function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      {user ? (
        <>
          <span>Hi, {user.name}!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
}

// Real company example — Theme Context
const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`app theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}
```

---

## Y2.4 — React Router

```jsx
import { BrowserRouter, Routes, Route, Link, NavLink,
         useNavigate, useParams, useLocation } from 'react-router-dom';

// Setup
function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/"        className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/products"        element={<Products />} />
        <Route path="/products/:id"    element={<ProductDetail />} />
        <Route path="/about"           element={<About />} />
        <Route path="/dashboard/*"     element={<Dashboard />} />
        <Route path="*"                element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// URL params lena
function ProductDetail() {
  const { id } = useParams(); // URL se :id
  const { data: product } = useFetch(`/api/products/${id}`);

  return <div>{product?.name}</div>;
}

// Navigate programmatically
function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate('/dashboard'); // Redirect karo
    // navigate(-1); // Back karo
  };

  return <button onClick={handleLogin}>Login</button>;
}

// Protected Routes
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Y2.5 — Forms (React Hook Form)

```jsx
import { useForm } from 'react-hook-form';

function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerAPI(data);
      reset(); // Form clear karo
      alert('Registration successful!');
    } catch(err) {
      alert('Error: ' + err.message);
    }
  };

  const password = watch('password'); // Watch field value

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name field */}
      <input
        {...register('name', {
          required: 'Name required hai!',
          minLength: { value: 2, message: 'Min 2 characters' }
        })}
        placeholder="Full Name"
      />
      {errors.name && <span className="error">{errors.name.message}</span>}

      {/* Email */}
      <input
        {...register('email', {
          required: 'Email required hai!',
          pattern: {
            value:   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Valid email do!'
          }
        })}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email.message}</span>}

      {/* Password */}
      <input
        type="password"
        {...register('password', {
          required:  'Password required!',
          minLength: { value: 8, message: 'Min 8 characters' }
        })}
        placeholder="Password"
      />

      {/* Confirm Password */}
      <input
        type="password"
        {...register('confirmPassword', {
          validate: (value) =>
            value === password || 'Passwords match nahi kar rahe!'
        })}
        placeholder="Confirm Password"
      />
      {errors.confirmPassword &&
        <span className="error">{errors.confirmPassword.message}</span>
      }

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

# 📅 YEAR 3 — Senior Level

---

## Y3.1 — State Management (Redux Toolkit)

```jsx
// Redux Toolkit = Modern Redux, boilerplate kam

// 1. Store setup
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Slice = actions + reducer ek saath
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:    [],
    total:    0,
    loading:  false,
  },
  reducers: {
    addItem(state, action) {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        exists.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total += action.payload.price;
    },

    removeItem(state, action) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) state.total -= item.price * item.quantity;
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
      state.total = 0;
    },
  },
});

// Async actions (Thunks)
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending,   (state) => { state.loading = true; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data    = action.payload;
      })
      .addCase(fetchUser.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.error.message;
      });
  },
});

import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId) => {
    const res = await fetch(`/api/users/${userId}`);
    return res.json();
  }
);

// Store
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    user: userSlice.reducer,
  },
});

// 2. Provider wrap karo
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>
  );
}

// 3. Components mein use karo
import { useSelector, useDispatch } from 'react-redux';

function Cart() {
  const { items, total } = useSelector(state => state.cart);
  const dispatch         = useDispatch();

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} × {item.quantity}</span>
          <button onClick={() => dispatch(cartSlice.actions.removeItem(item.id))}>
            Remove
          </button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
      <button onClick={() => dispatch(cartSlice.actions.clearCart())}>
        Clear Cart
      </button>
    </div>
  );
}
```

---

## Y3.2 — Performance Optimization

### React.memo
```jsx
import { memo, useCallback, useMemo } from 'react';

// memo = component memoize karo
// Same props aaye toh re-render mat karo

const ProductCard = memo(function ProductCard({ product, onAddCart }) {
  console.log('ProductCard render:', product.id);

  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={() => onAddCart(product)}>Add to Cart</button>
    </div>
  );
});

function ProductList({ products }) {
  const dispatch = useDispatch();

  // useCallback — function memoize karo
  const handleAddCart = useCallback((product) => {
    dispatch(addToCart(product));
  }, [dispatch]);

  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddCart={handleAddCart}
        />
      ))}
    </div>
  );
}
```

### Code Splitting & Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

// Lazy load — sirf jab chahiye tab load hoga
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics  = lazy(() => import('./pages/Analytics'));
const Settings   = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="spinner">Loading...</div>}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings"  element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Virtual List (Large Data)
```jsx
import { FixedSizeList } from 'react-window';

// 10,000 items render karo efficiently!
function LargeList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="row">
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## Y3.3 — API Integration (React Query)

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// React Query = Server state management
// Caching, refetching, loading states — automatic!

// Setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  5 * 60 * 1000, // 5 min cache
      retry:      3,              // 3 baar retry
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>...</Router>
    </QueryClientProvider>
  );
}

// GET — data fetch karo
function Products() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn:  () => fetch('/api/products').then(r => r.json()),
  });

  if (isLoading) return <Spinner />;
  if (isError)   return <Error message={error.message} />;

  return (
    <div>
      {data.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// POST/PUT/DELETE — mutations
function AddProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newProduct) =>
      fetch('/api/products', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(newProduct),
      }).then(r => r.json()),

    onSuccess: () => {
      // Cache invalidate karo — products list refresh hogi
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleSubmit = (productData) => {
    mutation.mutate(productData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Product'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

---

## Y3.4 — Error Boundaries

```jsx
import { Component } from 'react';

// Error Boundary = Component crash hone pe fallback dikhao
// Class component hona chahiye (hooks ka version nahi hai)

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Error logging service ko bhejo
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Kuch galat hua! 😢</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Dobara try karo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
```

---

## Y3.5 — TypeScript with React

```tsx
// TypeScript = JavaScript + Types
// Company mein mostly TypeScript use hoti hai

// Props types define karo
interface UserCardProps {
  name:      string;
  age:       number;
  email?:    string;  // Optional — ? se
  onClick:   (id: number) => void;
  children?: React.ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({
  name, age, email, onClick, children
}) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
      {email && <p>{email}</p>}
      <button onClick={() => onClick(1)}>Click</button>
      {children}
    </div>
  );
};

// State types
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState<number>(0);
const [items, setItems] = useState<Product[]>([]);

// Interface
interface Product {
  id:       number;
  name:     string;
  price:    number;
  category: string;
  inStock:  boolean;
}

// API response type
interface ApiResponse<T> {
  data:    T;
  message: string;
  status:  number;
}

async function fetchProducts(): Promise<ApiResponse<Product[]>> {
  const res = await fetch('/api/products');
  return res.json();
}
```

---

# 📅 YEAR 4 — Lead Level

---

## Y4.1 — Next.js (Production Framework)

```jsx
// Next.js = React + SSR + File-based routing + API routes

// File structure
pages/
├── index.jsx          ← / route
├── about.jsx          ← /about route
├── products/
│   ├── index.jsx      ← /products
│   └── [id].jsx       ← /products/:id
└── api/
    └── products.js    ← API endpoint

// SSR — Server Side Rendering
// Har request pe server se HTML
export async function getServerSideProps(context) {
  const { id } = context.params;
  const product = await fetchProduct(id);

  return {
    props: { product }
  };
}

function ProductPage({ product }) {
  return <div>{product.name}</div>;
}

// SSG — Static Site Generation
// Build time pe HTML generate
export async function getStaticProps() {
  const products = await fetchAllProducts();
  return {
    props:   { products },
    revalidate: 60 // Har 60 sec pe regenerate
  };
}

// Dynamic paths ke liye
export async function getStaticPaths() {
  const products = await fetchAllProducts();
  return {
    paths:    products.map(p => ({ params: { id: p.id.toString() } })),
    fallback: 'blocking'
  };
}

// API Routes
// pages/api/products.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const products = await Product.find();
    res.json(products);
  } else if (req.method === 'POST') {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  }
}

// App Router (Next.js 13+)
// app/products/page.jsx
async function ProductsPage() {
  // Server Component — direct server pe run
  const products = await fetch('https://api.example.com/products');
  const data     = await products.json();

  return (
    <div>
      {data.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

---

## Y4.2 — Testing (React Testing Library)

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest'; // Ya jest

// Component test
describe('LoginForm', () => {
  test('renders login form', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('shows error for empty fields', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email required hai!')).toBeInTheDocument();
  });

  test('calls login API on submit', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ token: 'abc' });
    render(<LoginForm onLogin={mockLogin} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email:    'test@test.com',
        password: 'password123'
      });
    });
  });
});

// Custom hook test
import { renderHook, act } from '@testing-library/react';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(0));

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

---

## Y4.3 — Micro Frontend Architecture

```jsx
// Bade companies mein yeh use hota hai
// Multiple teams independently deploy kar sakti hain

// Module Federation (Webpack 5)
// Team A: Products micro-frontend
// Team B: Cart micro-frontend
// Team C: User micro-frontend

// webpack.config.js (Host app)
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    products: 'products@http://localhost:3001/remoteEntry.js',
    cart:     'cart@http://localhost:3002/remoteEntry.js',
  },
})

// webpack.config.js (Products app)
new ModuleFederationPlugin({
  name:     'products',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductList': './src/ProductList',
  },
})

// Host app mein use karo
const ProductList = lazy(() => import('products/ProductList'));
const Cart        = lazy(() => import('cart/Cart'));

function App() {
  return (
    <div>
      <Suspense fallback="Loading...">
        <ProductList />
        <Cart />
      </Suspense>
    </div>
  );
}
```

---

## Y4.4 — CI/CD & Deployment

```yaml
# .github/workflows/deploy.yml

name: React App CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm run lint      # ESLint check
      - run: npm run test      # Unit tests
      - run: npm run build     # Production build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npm run deploy    # Vercel/Netlify deploy
```

---

## Y4.5 — Real Company Project Structure

```
my-app/
├── public/
├── src/
│   ├── app/
│   │   ├── store.ts           ← Redux store
│   │   └── hooks.ts           ← Typed hooks
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/            ← Reusable
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── layout/
│   │       ├── Header/
│   │       ├── Footer/
│   │       └── Sidebar/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts
│   │   │   ├── LoginForm.tsx
│   │   │   └── authAPI.ts
│   │   ├── products/
│   │   │   ├── productsSlice.ts
│   │   │   ├── ProductList.tsx
│   │   │   └── productsAPI.ts
│   │   └── cart/
│   ├── hooks/
│   │   ├── useFetch.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── pages/
│   │   ├── Home/
│   │   ├── Dashboard/
│   │   └── Settings/
│   ├── services/
│   │   ├── api.ts             ← Axios instance
│   │   └── auth.ts
│   ├── types/
│   │   └── index.ts           ← All types
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── .eslintrc.js
├── tsconfig.json
└── vite.config.ts
```

### API Service Setup
```ts
// services/api.ts — Axios instance

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — token add karo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — errors handle karo
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

# ⚡ COMPLETE QUICK REVISION

```
YEAR 1 — Basics:
Component     → Function jo JSX return kare
Props         → Parent se child ko data — READ ONLY
State         → Component ka apna data — useState
useEffect     → Side effects — API, timers
Events        → onClick, onChange, onSubmit
Lists         → map() + key prop COMPULSORY
Conditional   → {condition && <div>} ya ternary

YEAR 2 — Intermediate:
useRef        → DOM access ya value hold (no re-render)
useCallback   → Function memoize — same reference
useMemo       → Value memoize — expensive calculation
useReducer    → Complex state — action → reducer
Custom Hooks  → Reusable logic — "use" se start
Context       → Global state — props drilling avoid
Router        → BrowserRouter, Routes, Route, Link
Forms         → React Hook Form — validation easy

YEAR 3 — Senior:
Redux Toolkit → Global state — createSlice, useSelector
React.memo    → Component memoize — same props no re-render
Code Split    → lazy() + Suspense — bundle split
React Query   → Server state — caching, refetching
Error Boundary→ Crash fallback — class component
TypeScript    → Types + Interfaces — company standard
Testing       → RTL + Jest — render, screen, fireEvent

YEAR 4 — Lead:
Next.js       → SSR + SSG + API routes
Micro Frontend→ Module Federation — team independence
CI/CD         → GitHub Actions — test + deploy
Architecture  → Feature-based folder structure
Axios Setup   → Interceptors — auth, error handling
Performance   → Virtual list, memo, lazy loading
```

---

# 💰 Salary Journey

```
Year 1 (Junior React):     6-10 LPA
Year 2 (Mid React):        10-16 LPA
Year 3 (Senior React):     16-24 LPA
Year 4 (Lead/Architect):   24-40 LPA
Abroad (Year 3-4):         80-150 LPA! 🔥
```

---

# 🎯 Daily Routine

```
Morning (30 min):
☑ 1 React concept padho
☑ Official docs dekho — react.dev

Office:
☑ Best practices follow karo
☑ Code reviews seriously lo
☑ Test likhna seekho

Evening (1 hour):
☑ Side project karo
☑ Ek feature implement karo

Weekend:
☑ Full app banao
☑ GitHub pe daalo — portfolio!
```

---

# 🏆 Year-wise Checklist

```
Year 1 ✅:
☑ Components, Props, State
☑ useEffect properly
☑ Basic routing
☑ First React app deployed

Year 2 ✅:
☑ All hooks mastered
☑ Custom hooks banaye
☑ Context API
☑ Forms validation
☑ Company project contribute kiya

Year 3 ✅:
☑ Redux Toolkit
☑ Performance optimized
☑ TypeScript mein likha
☑ Testing likhna aata hai
☑ Senior title mila

Year 4 ✅:
☑ Next.js project banaya
☑ Architecture design kiya
☑ Team lead kiya
☑ CI/CD setup kiya
☑ 25+ LPA! 🎉
```

---

*Bhai yeh 4 saal consistently karo — React senior ban jaoge! 💪🔥⚛️*