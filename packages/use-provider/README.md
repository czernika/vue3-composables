# useProvider

A lightweight, type-safe wrapper around Vue's native provide/inject API for Vue 3 Composition API. It provides a clean and intuitive way to share state and services across your component hierarchy with full TypeScript support and runtime safety.

## Why useProvider?

Traditional Vue provide/inject pattern can be verbose and lacks type safety. useProvider solves this with:

- 🚀 **Full TypeScript support** - Complete type inference and safety
- 🎯 **Simple API** - Clean, intuitive syntax with autocomplete
- 🔒 **Runtime safety** - Clear error messages when provider is missing
- ⚡ **Zero dependencies** - Just Vue 3, nothing else

## Installation

```sh
# npm
npm install @czernika/use-provider

# yarn
yarn add @czernika/use-provider

# pnpm
pnpm add @czernika/use-provider

# bun
bun add @czernika/use-provider
```

## Usage

### Basic Example

Define the interface for your counter logic and provide key:

```ts
// Define the shape of your provider data
interface CounterContext {
    count: Ref<number>
    increment: () => void
    decrement: () => void
    reset: () => void
}

// Create a dedicated file for provider keys
export const PROVIDER_KEYS = {
  COUNTER: 'counter-context',
} as const
```

_💡 Best practice: Always define interfaces for your provider data to get full TypeScript support. Use descriptive keys like 'counter' rather than generic names. Consider exporting keys as constants._

Provide the counter in a parent component:

```vue
<!-- CounterProvider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'

// Create counter logic
const count = ref(0)

const counterContext: CounterContext = {
  count,
  increment: () => count.value++,
  decrement: () => count.value--,
  reset: () => count.value = 0
}

// Provide with a unique key
provide(PROVIDER_KEYS.COUNTER, counterContext)
</script>

<template>
    <slot />
</template>
```

```vue
<!-- CounterConsumer.vue -->
<script setup lang="ts">
const { count, increment, decrement, reset } = useProvider<CounterContext>(PROVIDER_KEYS.COUNTER)
</script>
```

## API reference

```ts
function useProvider<T>(key: string): NonNullable<T>
```

- `T`: Type parameter for the provider data
- `key`: Unique string identifier for the provider
- **Returns:** The provided value (guaranteed non-null)
- **Throws:** Error if provider with given key is not found

## Troubleshooting

### Error: "Incorrect use of provider..."

This error occurs when:

1. Provider wasn't set up in any parent component
2. Provider key doesn't match between provide/inject
3. Component is rendered outside provider hierarchy

**Solutions:**

- Check that `provide()` is called before component renders
- Verify key spelling matches exactly
- Ensure child component is within the provider's template

## Contributing

Found a bug or have a feature request? Please open an issue on GitHub.

## License

MIT © Czernika (Aliakseyenka Ihar)
