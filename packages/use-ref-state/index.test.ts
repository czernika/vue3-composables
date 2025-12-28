import { describe, it, expect } from 'vitest'
import { useRefState } from '.'
import { isReadonly } from 'vue'

describe('useRefState', () => {
	describe('basic functionality', () => {
		it('should initialize with provided value', () => {
			const [state] = useRefState(42)
			expect(state.value).toBe(42)
		})

		it('should initialize with undefined when no value provided', () => {
			const [state] = useRefState()
			expect(state.value).toBeUndefined()
		})

		it('should update state with direct value', () => {
			const [state, setState] = useRefState(0)
			setState(42)
			expect(state.value).toBe(42)
		})

		it('should update state with functional updater', () => {
			const [state, setState] = useRefState(1)
			setState((prev) => ++prev)
			expect(state.value).toBe(2)
		})

		it('should update state with functional updater', () => {
			const [state, setState] = useRefState(1)
			setState((prev) => prev + 1)
			expect(state.value).toBe(2)
		})
	})

	describe('readonly mode', () => {
		it('should return readonly ref by default', () => {
			const [state] = useRefState(42)
			expect(isReadonly(state)).toBeTruthy()
		})

		it('should allow mutable ref when asReadonly is false', () => {
			const [state] = useRefState(42, false)
			state.value = 100
			expect(state.value).toBe(100)
		})
	})

	describe('complex state objects', () => {
		interface User {
			name: string
			age: number
		}

		it('should handle object state', () => {
			const initialUser: User = { name: 'John', age: 30 }
			const [user, setUser] = useRefState(initialUser)

			setUser({ name: 'Jane', age: 25 })
			expect(user.value.name).toBe('Jane')
			expect(user.value.age).toBe(25)
		})

		it('should handle functional updates with objects', () => {
			const [user, setUser] = useRefState<User>({ name: 'John', age: 30 })

			setUser((prev) => ({ ...prev, age: 31 }))
			expect(user.value).toEqual({ name: 'John', age: 31 })
		})
	})

	describe('edge cases', () => {
		it('should handle null and undefined values', () => {
			const [nullState] = useRefState<null>(null)
			expect(nullState.value).toBeNull()

			const [undefinedState] = useRefState<undefined>()
			expect(undefinedState.value).toBeUndefined()
		})

		it('should handle array state', () => {
			const [arr, setArr] = useRefState([1, 2, 3])

			setArr((prev) => [...prev, 4])
			expect(arr.value).toEqual([1, 2, 3, 4])
		})
	})

	describe('type safety', () => {
		it('should infer correct types for simple values', () => {
			const [num] = useRefState(42)
			expect(typeof num.value).toBe('number')
		})

		it('should allow mutation in mutable mode', () => {
			const [state] = useRefState({ value: 1 }, false)
			state.value = { value: 2 }
			expect(state.value.value).toBe(2)
		})
	})
})
