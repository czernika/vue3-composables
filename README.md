# List of useful Vue3 composables

### useRefState

**React-like state management for Vue 3**

Get `[state, setState]` pattern with functional updates. Perfect for those coming from React or wanting better state mutation control.

```vue
<script setup lang="ts">
const [count, setCount] = useRefState(0)
// Increment: setCount(count.value + 1)
// Functional: setCount(prev => prev + 1)
</script>
```

- [Read full docs](./packages/use-ref-state/README.md)

### useProvider

**Type-safe dependency injection**

A clean wrapper around Vue's provide/inject with full TypeScript support and better error messages.

```vue
<!-- Parent -->
<script setup>
provide('user', { name: 'John' })
</script>

<!-- Child -->
<script setup>
const user = useProvider('user') // Type-safe!
</script>
```

- [Read full docs](./packages/use-provider/README.md)

## License

Open-source under [MIT license](LICENSE)
