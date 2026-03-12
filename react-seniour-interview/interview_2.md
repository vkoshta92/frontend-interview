=========================================
SENIOR REACT INTERVIEW QUESTIONS & ANSWERS
=========================================

-----------------------------------------
CORE REACT CONCEPTS
-----------------------------------------

1. How does React work internally?
React creates a Virtual DOM, compares it with previous Virtual DOM (reconciliation),
finds the minimal changes, and updates the real DOM efficiently.

One-liner:
React updates UI using Virtual DOM diffing and reconciliation.

-----------------------------------------

2. What is reconciliation?
Reconciliation is the process of comparing the new Virtual DOM with the old one
to determine the minimum DOM updates.

-----------------------------------------

3. What is Fiber in React?
Fiber is React’s internal architecture that enables:
- Incremental rendering
- Pausing and resuming work
- Priority-based updates

-----------------------------------------

4. Why keys are important in lists?
Keys help React identify which items changed, added, or removed.
Without keys, React may re-render unnecessary components.

-----------------------------------------
HOOKS (ADVANCED)
-----------------------------------------

5. Difference between useState and useReducer?
useState:
- Simple state
- Less boilerplate

useReducer:
- Complex state logic
- Predictable updates
- Better for large components

-----------------------------------------

6. Why hooks must be called at top level?
To ensure consistent hook order between renders.
Conditional hooks break React’s hook tracking.

-----------------------------------------

7. What problems does useCallback solve?
It prevents unnecessary re-creation of functions
which helps avoid unnecessary child re-renders.

-----------------------------------------

8. useCallback vs useMemo?
useCallback → memoizes function
useMemo → memoizes computed value

-----------------------------------------

9. When should you NOT use useMemo/useCallback?
- For cheap calculations
- Premature optimization
- When it reduces readability

-----------------------------------------
PERFORMANCE OPTIMIZATION
-----------------------------------------

10. How do you optimize React performance?
- React.memo
- useCallback / useMemo
- Code splitting (lazy)
- Avoid unnecessary state
- Virtualization (large lists)

-----------------------------------------

11. What is React.memo?
React.memo prevents re-rendering of a component
if props have not changed.

-----------------------------------------

12. What causes unnecessary re-renders?
- Inline functions
- Object/array recreation
- Lifting state unnecessarily
- Context overuse

-----------------------------------------
STATE MANAGEMENT
-----------------------------------------

13. Context API vs Redux?
Context:
- Data sharing
- Small to medium apps

Redux:
- Complex global state
- Predictable state changes
- Middleware support

-----------------------------------------

14. When should you NOT use Redux?
- Small apps
- Form state
- Local UI state

-----------------------------------------

15. Zustand vs Redux (Senior-level answer)?
Zustand:
- Minimal boilerplate
- Simple global state

Redux:
- Strong ecosystem
- Better for large enterprise apps

-----------------------------------------
ARCHITECTURE & DESIGN
-----------------------------------------

16. How do you structure a large React app?
- Feature-based folder structure
- Reusable components
- Custom hooks
- Separation of UI & business logic

-----------------------------------------

17. What are custom hooks?
Custom hooks extract reusable logic from components.
They must follow hook rules.

-----------------------------------------

18. How do you handle side effects properly?
- useEffect with correct dependencies
- Cleanup functions
- Abort controllers for API calls

-----------------------------------------
FORMS & VALIDATION
-----------------------------------------

19. Why controlled forms are expensive?
Because every keystroke triggers state update and re-render.

-----------------------------------------

20. How do you optimize large forms?
- useReducer
- Uncontrolled inputs (useRef)
- Validate on submit
- Split form components

-----------------------------------------
RENDERING & LIFECYCLE
-----------------------------------------

21. useEffect vs useLayoutEffect?
useEffect:
- Runs after paint
- Non-blocking

useLayoutEffect:
- Runs before paint
- Blocking
- Used for DOM measurements

-----------------------------------------

22. What is StrictMode?
StrictMode helps detect:
- Side effects
- Unsafe lifecycles
- Double rendering in dev

-----------------------------------------
CONCURRENCY (REACT 18)
-----------------------------------------

23. What is useTransition?
Allows low-priority state updates to keep UI responsive.

-----------------------------------------

24. What problem does concurrent rendering solve?
Prevents UI blocking during heavy rendering tasks.

-----------------------------------------
SECURITY & BEST PRACTICES
-----------------------------------------

25. How do you prevent XSS in React?
- React escapes JSX by default
- Avoid dangerouslySetInnerHTML

-----------------------------------------

26. How do you handle errors in React?
- Error Boundaries
- Try/catch for async logic

-----------------------------------------
TESTING
-----------------------------------------

27. How do you test React components?
- Unit tests (Jest)
- Component tests (React Testing Library)
- Integration tests

-----------------------------------------
REAL-WORLD SCENARIOS
-----------------------------------------

28. How do you handle API calls?
- useEffect
- AbortController
- Loading & error states

-----------------------------------------

29. How do you avoid memory leaks?
- Cleanup effects
- Cancel API calls
- Clear timers

-----------------------------------------

30. How do you explain React to a junior?
React is a UI library that builds reusable components
and updates the UI efficiently using Virtual DOM.

-----------------------------------------
RAPID FIRE (SENIOR MUST KNOW)
-----------------------------------------

Virtual DOM → Performance
Keys → List identity
Reducer → Predictable state
Context → Avoid prop drilling
Redux → Global complex state
useMemo → Expensive calculation
useCallback → Stable functions
StrictMode → Dev warnings
Fiber → Concurrent rendering

-----------------------------------------
FINAL SENIOR INTERVIEW ANSWER
-----------------------------------------

React is a declarative UI library that uses Virtual DOM,
Fiber architecture, and hooks to build scalable,
performant, and maintainable front-end applications.

=========================================
END
=========================================
