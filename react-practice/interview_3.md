=========================================================
SENIOR REACT – COMPLETE INTERVIEW MASTER FILE
(Machine Coding + Architecture + Debugging + System Design)
=========================================================

---------------------------------------------------------
SECTION 1: SENIOR REACT MACHINE CODING ROUND
---------------------------------------------------------

1. What do interviewers expect in machine coding?
- Clean component structure
- Correct hooks usage
- Performance awareness
- Edge cases handling
- Readable & scalable code

-----------------------------------------

2. Common machine coding problems:
- Counter with optimization
- Todo app
- Search with debounce
- Pagination
- Modal component
- Form with validation
- API data fetching

-----------------------------------------

3. Machine Coding Checklist (VERY IMPORTANT):
- Proper state placement
- Avoid unnecessary re-renders
- useCallback / useMemo where needed
- Cleanup useEffect
- Meaningful variable names

-----------------------------------------

4. Example Expectations (Todo App):
- Separate UI and logic
- Controlled inputs
- Unique keys
- Edit / delete functionality
- Performance optimization

-----------------------------------------

5. Common mistakes in machine coding:
- Inline functions everywhere
- No keys in list
- Too many states
- No cleanup in useEffect
- Overusing Context API

-----------------------------------------
SECTION 2: FRONTEND ARCHITECTURE INTERVIEW
---------------------------------------------------------

6. How do you structure a large React application?
- Feature-based folder structure
- Reusable components
- Custom hooks
- Services for API logic

Example:
src/
  features/
    auth/
    dashboard/
  components/
  hooks/
  services/
  utils/

-----------------------------------------

7. Why feature-based architecture?
- Better scalability
- Easier maintenance
- Team collaboration friendly

-----------------------------------------

8. UI vs Business Logic separation:
- UI → Components
- Logic → Hooks / Services

-----------------------------------------

9. What are container & presentational components?
- Container: handles logic & state
- Presentational: only UI

-----------------------------------------

10. How do you manage global state?
- Context API (small apps)
- Redux / Zustand (large apps)
- Local state for UI

-----------------------------------------

11. When NOT to use global state?
- Form input
- Modal open/close
- Local UI state

-----------------------------------------
SECTION 3: REACT DEBUGGING SCENARIOS
---------------------------------------------------------

12. Component re-rendering too many times – why?
- State updates on every render
- Inline objects/functions
- Context value changes

-----------------------------------------

13. How to debug re-render issues?
- React DevTools Profiler
- console.log renders
- Check dependency arrays

-----------------------------------------

14. Infinite loop in useEffect – cause?
- Updating state inside effect
- Missing or wrong dependency array

-----------------------------------------

15. How to fix infinite loop?
- Correct dependency array
- Move logic outside useEffect
- Use refs when needed

-----------------------------------------

16. API called multiple times – why?
- useEffect dependency issue
- StrictMode double rendering (dev)

-----------------------------------------

17. Memory leak in React – example?
- setTimeout not cleared
- API request not cancelled

-----------------------------------------

18. How to prevent memory leaks?
- Cleanup functions
- AbortController
- Clear timers

-----------------------------------------

19. App is slow with large lists – solution?
- Virtualization (react-window)
- Memoized components
- Pagination

-----------------------------------------
SECTION 4: REACT + SYSTEM DESIGN (FRONTEND)
---------------------------------------------------------

20. How do you design a scalable frontend?
- Component reusability
- Lazy loading
- State separation
- Performance optimization

-----------------------------------------

21. How do you handle authentication?
- Token storage (httpOnly cookies preferred)
- Protected routes
- Auth context / store

-----------------------------------------

22. How do you handle API errors globally?
- Axios interceptors
- Error boundaries
- Central error handler

-----------------------------------------

23. How do you handle theming?
- Context API
- CSS variables
- Theme provider

-----------------------------------------

24. How do you handle role-based access?
- Permission mapping
- Route guards
- Conditional rendering

-----------------------------------------

25. How do you optimize initial load?
- Code splitting
- Lazy loading
- Tree shaking
- Minification

-----------------------------------------

26. How do you handle real-time data?
- WebSockets
- Polling
- Event-driven updates

-----------------------------------------

27. How do you handle form-heavy apps?
- useReducer
- Uncontrolled inputs
- Validation on submit

-----------------------------------------

28. How do you explain React architecture to backend team?
React is a component-based UI system where state drives UI,
and updates are efficiently handled using Virtual DOM and Fiber.

-----------------------------------------
RAPID FIRE – SENIOR LEVEL
-----------------------------------------

Machine Coding → Clean + Optimized
Architecture → Feature-based
Performance → Memoization
Debugging → Profiler + Effects
System Design → Scalability
Forms → Local state
Global State → Redux/Zustand
Re-renders → Memo + Callbacks

-----------------------------------------
FINAL SENIOR INTERVIEW ANSWER
-----------------------------------------

A senior React developer focuses on scalable architecture,
clean component design, optimized rendering, predictable state
management, and real-world performance and debugging strategies.

=========================================================
END OF FILE
=========================================================
