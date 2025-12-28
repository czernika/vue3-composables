# List of useful Vue3 composables

[![Run tests](https://github.com/czernika/vue3-composables/actions/workflows/tests.yml/badge.svg)](https://github.com/czernika/vue3-composables/actions/workflows/tests.yml)

### useRefState

**React-like state management for Vue 3**

Get `[state, setState]` pattern with functional updates. Perfect for those coming from React or wanting better state mutation control.

```vue
<script setup lang="ts">
const [count, setCount] = useRefState(0)
// Set value 
setCount(1)

// Functional
setCount(prev => prev + 1)

const [state, setState] = useRefState({ name: 'John', age: 42 })
setState(prev => ({
    ...prev,
    age: 43,
}))
</script>
```

- [Read full docs](./packages/use-ref-state/README.md)

### useProvider

**Type-safe dependency injection**

A clean wrapper around Vue's provide/inject with full TypeScript support and better error messages.

```vue
<!-- Parent -->
<script setup>
interface User {
    name: string
}

provide<User>('user', { name: 'John' })
</script>

<!-- Any nested child -->
<script setup>
const user = useProvider<User>('user')
</script>
```

- [Read full docs](./packages/use-provider/README.md)

## License

Open-source under [MIT license](LICENSE)
