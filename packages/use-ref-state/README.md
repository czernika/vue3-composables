# useRefState

A React-inspired state management utility for Vue 3 Composition API that provides a familiar useState pattern with TypeScript support and additional flexibility.

## Why useRefState?

While Vue's ref() is powerful, useRefState offers a more React-like API with additional features:

- 🎯 **React-like API** - Familiar [state, setState] pattern for React developers
- 🔒 **Readonly by default** - Prevents accidental mutations outside the setter
- 🚀 **Functional updates** - Supports both direct values and functional updaters
- ⚡ **Type-safe** - Full TypeScript support with proper type inference
- 🎨 **Flexible** - Optional readonly mode for different use cases

## Comparison with Vue's ref()

```ts
// Vue's native ref()
const count = ref(0)
count.value++ // Direct mutation

// useRefState (readonly by default)
const [count, setCount] = useRefState(0)
// count.value++ // ❌ Error: readonly
setCount(5) // ✅ Functional update
setCount(prev => prev + 1) // ✅ Also works

// useRefState (mutable mode)
const [count, setCount] = useRefState(0, false)
count.value++ // ✅ Works
setCount(prev => prev + 1) // ✅ Also works
```

## Installation

```sh
# npm
npm install @czernika/use-ref-state

# yarn
yarn add @czernika/use-ref-state

# pnpm
pnpm add @czernika/use-ref-state

# bun
bun add @czernika/use-ref-state
```

## Usage

### Basic example

```vue
<script setup lang="ts">
import { useRefState } from '@czernika/use-ref-state'

// Basic usage with type inference
const [count, setCount] = useRefState(0)

// Update state
const increment = () => setCount(prev => ++prev)
const reset = () => setCount(0)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="() => setCount(prev => prev + 5)">
      Add 5 (functional)
    </button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

### Complex State Objects

```vue
<script setup lang="ts">
import { useRefState } from '@czernika/use-ref-state'

interface User {
  id: string
  name: string
  email: string
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

const [user, setUser] = useRefState<User>({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'light',
    notifications: true
  }
})

// Update nested properties
const toggleTheme = () => {
  setUser(prev => ({
    ...prev,
    preferences: {
      ...prev.preferences,
      theme: prev.preferences.theme === 'light' ? 'dark' : 'light'
    }
  }))
}

// Partial updates
const updateName = (newName: string) => {
  setUser(prev => ({ ...prev, name: newName }))
}

// Full replacement
const loadNewUser = () => {
  setUser({
    id: 'user-456',
    name: 'Jane Smith',
    email: 'jane@example.com',
    preferences: { theme: 'dark', notifications: false }
  })
}
</script>
```

### Custom Hooks with useRefState

```ts
// composables/useCounter.ts
import { useRefState, computed } from '@vue/composition-api'

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useRefState(initialValue)
  
  const double = computed(() => count.value * 2)
  const triple = computed(() => count.value * 3)
  
  const increment = (amount = 1) => setCount(prev => prev + amount)
  const decrement = (amount = 1) => setCount(prev => prev - amount)
  const reset = () => setCount(initialValue)
  
  return {
    count,
    setCount,
    double,
    triple,
    increment,
    decrement,
    reset
  }
}

// Usage in component
const { count, double, increment } = useCounter(10)
```

### Performance Optimization with Functional Updates

```vue
<script setup lang="ts">
import { useRefState } from '@czernika/use-ref-state'

const [items, setItems] = useRefState<string[]>([])

// Efficient batch updates
const addItemsBatch = (newItems: string[]) => {
  setItems(prev => [...prev, ...newItems])
}

// Complex transformation
const processItems = () => {
  setItems(prev => 
    prev
      .map(item => item.toUpperCase())
      .filter(item => item.length > 3)
      .sort()
  )
}

// Conditional updates
const toggleItem = (targetItem: string) => {
  setItems(prev => 
    prev.includes(targetItem)
      ? prev.filter(item => item !== targetItem)
      : [...prev, targetItem]
  )
}
</script>
```

## Readonly vs Mutable Mode

```vue
<script setup lang="ts">
import { useRefState } from '@czernika/use-ref-state'

// Readonly by default (recommended for most cases)
const [readonlyState, setReadonlyState] = useRefState({ value: 1 })
// readonlyState.value = 2 // ❌ TypeScript error: Cannot assign to read-only property

// Mutable mode (when you need direct access)
const [mutableState, setMutableState] = useRefState({ value: 1 }, false)
mutableState.value = 2 // ✅ Works in mutable mode

// Use cases for mutable mode:
const [timer, setTimer] = useRefState(0, false)

// Direct mutation might be needed for performance
const startTimer = () => {
  setInterval(() => {
    timer.value++ // Direct mutation
  }, 1000)
}Performance Optimization with Functional Updates

// Still have setTimer for functional updates
const resetTimer = () => {
  setTimer(0) // Using setter
}
</script>
```

## API Reference

```ts
function useRefState<TState>(
  initialValue?: TState,
  asReadonly?: true
): [Readonly<Ref<TState>>, (setter: TState | StateSetterFn<TState>) => void]

function useRefState<TState>(
  initialValue?: TState,
  asReadonly?: false
): [Ref<TState>, (setter: TState | StateSetterFn<TState>) => void]
```

The function uses TypeScript overloads to provide different return types based on the asReadonly parameter:

```ts
// Readonly mode (default)
const [state, setState] = useRefState(0)
// state: Readonly<Ref<number>> - cannot do state.value = 5
// setState: (number | (prev: number) => number) => void

// Mutable mode
const [state, setState] = useRefState(0, false)
// state: Ref<number> - can do state.value = 5
// setState: (number | (prev: number) => number) => void
```

**Parameters:**

- `initialValue` (`TState`, optional): Initial state value. If not provided, defaults to `undefined`.
- `asReadonly` (`boolean`, optional, default: `true`): Controls whether the returned state reference is readonly.
  - `true` (default): Returns `Readonly<Ref<TState>>` - prevents direct mutation, enforcing updates through the setter function
  - `false`: Returns `Ref<TState>` - allows direct .value assignment alongside the setter function

## Best Practices

- **Use functional updates** when new state depends on previous state
- **Keep state readonly by default** to prevent accidental mutations
- **Use TypeScript interfaces** for complex state objects
- **Extract complex logic** into custom composables
- **Consider performance** with large arrays/objects

## Troubleshooting

### State updates aren't triggering reactivity

- Ensure you're using `setState()` or direct `.value` assignment (in mutable mode)
- Check that you're not mutating nested objects directly
- **Watch out for external libraries** that mutate data under the hood without triggering Vue's reactivity system

For example, external UI libraries can mutate value on its own

```vue
<script setup lang="ts">
import { useRefState } from '@czernika/use-ref-state'

const [state, setState] = useRefState('')
</script>

<template>
    <!-- ❌ Cannot modify readonly value -->
    <UIInput v-model="state" />
</template>

<script setup lang="ts">
import { useRefState } from '@czernika/use-ref-state'

const [state, setState] = useRefState('', false)
</script>

<template>
    <!-- ✅ Works in mutable mode -->
    <UIInput v-model="state" />
</template>
```

Remember: Vue's reactivity system works on property access. If an external library doesn't use Vue's reactivity APIs, mutations won't be detected. Always assume you need to manually trigger updates when integrating with non-Vue libraries.

### Performance issues with large state

- Use functional updates to minimize reactivity overhead
- Consider using mutable mode for frequent updates
- Use computed properties for derived state

### Debugging Reactivity Issues

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { useRefState } from '@czernika/use-ref-state'

const [state, setState] = useRefState({ value: 1 })

// Add watcher to debug
watch(
  () => state.value,
  (newValue, oldValue) => {
    console.log('State changed:', oldValue, '→', newValue)
  },
  { deep: true } // For nested objects
)
</script>
```

## Contributing

Found a bug or have a feature request? Please open an issue on GitHub.

## License

MIT © Czernika (Aliakseyenka Ihar)

