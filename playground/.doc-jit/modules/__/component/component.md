# Component

## Intention

React apps are made out of components. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.

React components are JavaScript functions that return markup:

```jsx
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

## Key points

- The component is written in `PascalCase`,
- it respects [SOLID principles](https://konstantinlebedev.com/solid-in-react),
  - does not directly call external dependencies.

## Mistake to avoid

- Too many `useEffect` -> it is usually used to modify DOM, modify state, call callbacks and so on. If there are several of these hooks with a few dependencies each handling the logic, it’s impossible to decipher what’s actually happening.

## References

- [React documentation](https://react.dev/learn/your-first-component#defining-a-component)
- [VueJS documentation](https://vuejs.org/)
