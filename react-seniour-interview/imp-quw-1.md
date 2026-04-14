# 🚀 React Interview Prep (Hinglish Notes)

---

## 🔹 1. Counter App

* `useState` use karo

```js
const [count, setCount] = useState(0);

const inc = () => setCount(c => c + 1);
const dec = () => setCount(c => c - 1);
```

👉 Functional update use karo → stale state issue nahi aata

---

## 🔹 2. Form with Validation

* Controlled components (value + onChange)
* Validate:

  * onBlur
  * onSubmit

```js
const [errors, setErrors] = useState({});

if (!email.includes("@")) {
  errors.email = "Invalid email";
}
```

👉 Pro tip:

* React Hook Form → fast & optimized
* Formik → easy but thoda heavy

---

## 🔹 3. Fetch API Data

```js
useEffect(() => {
  fetch("/api")
    .then(res => res.json())
    .then(setData)
    .catch(setError);
}, []);
```

👉 Always handle:

* loading
* error
* empty state

---

## 🔹 4. Debounce Search

```js
useEffect(() => {
  const timer = setTimeout(() => {
    fetchData(query);
  }, 500);

  return () => clearTimeout(timer);
}, [query]);
```

👉 Har key press pe API hit nahi hoga

---

## 🔹 5. Todo List

State:

```js
[{ id, text, completed }]
```

Operations:

* Add → spread
* Delete → filter
* Toggle → map

---

## 🔹 6. Reusable Modal

```js
<Modal isOpen={isOpen} onClose={closeFn} />
```

👉 Best practice:

* Portal use karo (`createPortal`)

---

## 🔹 7. Multi Select Dropdown

```js
const [selected, setSelected] = useState([]);
```

👉 Toggle logic:

* already selected → remove
* else → add

---

## 🔹 8. Pagination

Backend se:

```
?page=1&limit=10
```

State:

```js
currentPage, totalPages
```

---

## 🔹 9. Custom Hook (useFetch)

```js
function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);

  return data;
}
```

👉 Reusable + clean code

---

## 🔹 10. Optimize Slow Component

Use:

* React.memo
* useMemo
* useCallback

👉 Heavy calculation → useMemo
👉 Function pass → useCallback

---

## 🔹 11. Infinite Scroll

Best approach:

* Intersection Observer 👌

---

## 🔹 12. Global State

* Small app → Context API
* Large app → Redux Toolkit

---

## 🔹 13. Global API Error Handling

```js
axios.interceptors.response.use(
  res => res,
  err => {
    console.log("Global Error", err);
    return Promise.reject(err);
  }
);
```

---

## 🔹 14. Dynamic Form

```js
const fields = [
  { name: "email", type: "text" },
  { name: "password", type: "password" }
];
```

👉 Map karke render karo

---

# 💡 Follow-up Questions (Interview Gold Answers)

---

## ❓ Prevent unnecessary re-renders?

👉 Answer:

* React.memo use karunga
* useCallback for functions
* useMemo for heavy calculations
* Component split karunga

---

## ❓ Form state kaise manage karoge?

👉 Answer:

* Small → useState
* Large → React Hook Form

---

## ❓ Loading / Error / Empty?

```js
if (loading) return "Loading...";
if (error) return "Error";
if (!data.length) return "No Data";
```

---

## ❓ API calls optimize kaise karoge?

👉 Answer:

* Debounce / Throttle
* Caching (React Query / SWR)
* Avoid duplicate calls

---

## ❓ State structure scalable kaise banega?

👉 Answer:

* Normalize data
* Separate UI state & server state
* Use reducers for complex logic

---

## ❓ Modal open/close clean kaise manage karoge?

👉 Answer:

* Single source of truth (parent state)
* Custom hook (useModal)

---

## ❓ Controlled vs Uncontrolled?

👉 Answer:

* Controlled → better validation & control
* Uncontrolled → simple & performant

---

## ❓ Large dataset handle kaise karoge?

👉 Answer:

* Pagination
* Virtualization (react-window)
* Lazy loading

---

## ❓ Custom hooks reusable kaise banaoge?

👉 Answer:

* Generic logic
* Accept params
* Return clean API (data, loading, error)

---

## ❓ React.memo vs useMemo vs useCallback?

👉 Answer:

* React.memo → component memo
* useMemo → value memo
* useCallback → function memo

---

## ❓ Infinite scroll kaise detect karoge?

👉 Answer:

* Intersection Observer (best)
* Scroll event (fallback)

---

## ❓ Context vs Redux?

👉 Answer:

* Context → small apps
* Redux → large scale, predictable state

---

## ❓ Error boundaries kaise design karoge?

👉 Answer:

* Wrap components
* Show fallback UI
* Log errors

---

## ❓ Dynamic forms scalable kaise banoge?

👉 Answer:

* Config-driven fields
* Reusable components
* Validation schema (Yup)

---

🔥 **Tip:** Interview me hamesha bolo:

> "I focus on performance, scalability, and clean architecture."

---
