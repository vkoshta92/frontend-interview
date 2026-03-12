# Senior React – Verbal Interview Questions & Answers (Spoken Style)

---

## 1. Tell me about yourself (Senior React)
I am a frontend developer with around X years of experience, mainly working with React, JavaScript, and modern frontend architecture. I focus on building scalable, performant applications, handling complex state, optimizing rendering, and collaborating closely with backend and product teams.

---

## 2. How does React work internally?
React uses a Virtual DOM. Whenever state changes, React creates a new Virtual DOM, compares it with the previous one using reconciliation, and updates only the changed parts in the real DOM. This makes UI updates efficient.

---

## 3. What is Fiber in React?
Fiber is React’s internal architecture that allows incremental rendering. It helps React pause, resume, and prioritize updates, which enables features like concurrent rendering in React 18.

---

## 4. Why hooks were introduced?
Hooks were introduced to reuse stateful logic, remove the complexity of class components, and make code more readable and maintainable.

---

## 5. Why hooks must be called at the top level?
Because React relies on the order of hooks. Calling hooks conditionally can break the hook order and cause bugs.

---

## 6. useState vs useReducer – when do you use what?
I use useState for simple local state. I prefer useReducer when the state logic is complex, involves multiple transitions, or when state updates depend on actions.

---

## 7. How do you avoid unnecessary re-renders?
By using React.memo for components, useCallback for functions, useMemo for expensive calculations, and by placing state at the correct level.

---

## 8. What causes performance issues in React apps?
Common reasons are unnecessary re-renders, large lists without virtualization, heavy computations during render, overusing Context API, and improper dependency arrays.

---

## 9. Context API vs Redux?
Context API is mainly for prop drilling and sharing simple data. Redux is for managing complex global state with predictable updates, middleware, and better debugging.

---

## 10. When should you NOT use Redux?
I avoid Redux for form inputs, local UI state like modals, and small applications where local state is sufficient.

---

## 11. How do you structure a large React application?
I follow a feature-based architecture with separation of components, hooks, services, and utilities. Business logic goes into hooks or services, UI stays in components.

---

## 12. How do you handle API calls?
I usually handle API calls inside useEffect or custom hooks, maintain loading and error states, and cancel requests using AbortController to avoid memory leaks.

---

## 13. What is cleanup in useEffect and why is it important?
Cleanup runs when a component unmounts or before the effect re-runs. It prevents memory leaks like uncleared timers or pending API calls.

---

## 14. Why does StrictMode cause double rendering?
StrictMode intentionally runs components twice in development to detect side effects and unsafe logic. It does not happen in production.

---

## 15. How do you debug React performance issues?
I use React DevTools Profiler, console logging render counts, and check dependency arrays to identify unnecessary renders.

---

## 16. How do you handle large lists?
I use list virtualization libraries like react-window or pagination to avoid rendering thousands of DOM nodes at once.

---

## 17. How do you handle forms in large applications?
For small forms, I use useState. For large or complex forms, I use useReducer or uncontrolled inputs. I usually validate on submit for better performance.

---

## 18. How do you handle authentication in frontend?
I store tokens securely, preferably in httpOnly cookies, protect routes, and manage auth state using Context or a global store.

---

## 19. How do you handle role-based access?
By mapping permissions to roles and controlling access using route guards and conditional rendering.

---

## 20. How do you handle global errors?
I use centralized error handling with Axios interceptors and display fallback UI using error boundaries.

---

## 21. How do you optimize initial page load?
By code splitting, lazy loading routes and components, reducing bundle size, and optimizing assets.

---

## 22. What are error boundaries?
Error boundaries catch JavaScript errors in the component tree and prevent the entire app from crashing.

---

## 23. Why React state updates are asynchronous?
React batches state updates for performance reasons, which is why updates are not immediately reflected.

---

## 24. How do you explain React to a non-frontend person?
React is a library for building user interfaces using reusable components where UI automatically updates when data changes.

---

## 25. What makes you a senior React developer?
My ability to design scalable architecture, write optimized and maintainable code, debug complex issues, and make the right trade-offs based on real-world requirements.

---

## FINAL VERBAL ONE-LINER (VERY IMPORTANT)

I focus on writing clean, scalable React code with proper state management, performance optimization, and real-world architectural decisions.

---

END OF FILE
