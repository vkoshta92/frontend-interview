===============================
REACT FORMS & HOOKS
INTERVIEW THEORETICAL QUESTIONS
===============================

-------------------------------
BASIC FORM QUESTIONS
-------------------------------

1. What is a controlled component?
A controlled component is a form element whose value is controlled by React state using useState.
The input value and changes are handled by React.

One-liner:
Controlled components are React-driven form elements.

--------------------------------

2. What is an uncontrolled component?
An uncontrolled component stores its value in the DOM instead of React state.
It is accessed using useRef.

One-liner:
Uncontrolled components use refs instead of state.

--------------------------------

3. Controlled vs Uncontrolled components?

Controlled:
- Uses useState
- React controls value
- Easy validation
- More re-renders

Uncontrolled:
- Uses useRef
- DOM controls value
- Better performance
- Less validation control

--------------------------------

4. Why is name attribute important in forms?
The name attribute helps identify which input field is being updated in a common handleChange function.

--------------------------------

5. Why do we use e.preventDefault() in forms?
To prevent the browser from refreshing the page when the form is submitted.

--------------------------------
HOOKS RELATED QUESTIONS
--------------------------------

6. Why use useState in forms?
To store input values and re-render UI when the value changes.

--------------------------------

7. When should we use useReducer instead of useState?
- Large forms
- Complex validation
- Multiple state updates

One-liner:
useReducer is better for complex form logic.

--------------------------------

8. How does useEffect help in forms?
useEffect is used for:
- Auto save
- API validation
- Watching input changes
- Side effects

--------------------------------

9. What is prop drilling?
Passing data from parent to deeply nested child components via props.

Solution:
Context API (useContext)

--------------------------------

10. When should you use Context API for forms?
- Multi-step forms
- Shared form state across many components

--------------------------------
PERFORMANCE QUESTIONS
--------------------------------

11. Why do forms cause performance issues?
Because every keystroke updates state and triggers re-render.

--------------------------------

12. How to optimize form performance?
- Use useRef for uncontrolled inputs
- Use useCallback for handlers
- Use useMemo for heavy validation
- Split components

--------------------------------

13. Difference between useCallback and useMemo?

useCallback:
- Memoizes function
- Prevents unnecessary re-render

useMemo:
- Memoizes value
- Prevents heavy recalculation

--------------------------------
ADVANCED QUESTIONS
--------------------------------

14. Why should reducers be pure?
Pure reducers ensure:
- Predictable output
- Easy debugging
- No side effects

--------------------------------

15. Why useRef does not cause re-render?
Because changing ref.current does not trigger React render cycle.

--------------------------------

16. What is a synthetic event in React?
React wraps native browser events into synthetic events for cross-browser consistency.

--------------------------------

17. How do you handle form validation without libraries?
Using:
- useState
- conditional rendering
- regex checks

--------------------------------

18. Why is useId important in forms?
It helps generate unique IDs for accessibility and linking labels with inputs.

--------------------------------
TRICK QUESTIONS
--------------------------------

19. Is Context API a replacement for Redux?
No.
Context is for data sharing, Redux is for complex state management.

--------------------------------

20. Why not store form data in Redux?
- Too many updates
- Performance issues
- Forms are local state

--------------------------------
REAL WORLD QUESTIONS
--------------------------------

21. How do you handle large forms in production?
- useReducer
- Controlled + uncontrolled mix
- Validate on submit
- Lazy rendering

--------------------------------

22. Formik vs React Hook Form?

Formik:
- Controlled
- More re-renders

React Hook Form:
- Uncontrolled
- Better performance

--------------------------------
RAPID FIRE (MUST REMEMBER)
--------------------------------

Controlled input → useState
Uncontrolled input → useRef
Complex form → useReducer
Multi-step form → Context API
Performance issue → re-renders
Optimization → useCallback & useMemo

--------------------------------
FINAL INTERVIEW ONE-LINER
--------------------------------

React forms are handled using controlled components with useState or useReducer, optimized using useRef, useCallback, and Context API when required.

===============================
END
===============================
