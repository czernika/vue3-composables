import { describe, it, expect } from 'vitest'
import { createApp, defineComponent, h, provide } from 'vue'
import { useProvider } from '.'

const TEST_KEY = 'test-provider'
interface TestData {
	name: string
	value: number
}

describe('useProvider', () => {
	it('should retrieve data from provider successfully', () => {
		const testData: TestData = { name: 'test', value: 42 }

		const Provider = defineComponent({
			setup(_, { slots }) {
				provide(TEST_KEY, testData)
				return () => h('div', slots.default?.())
			},
		})

		const Consumer = defineComponent({
			setup() {
				const data = useProvider<TestData>(TEST_KEY)
				return () =>
					h('div', `Name: ${data.name}, Value: ${data.value}`)
			},
		})

		const app = createApp(
			defineComponent({
				render() {
					return h(Provider, {}, () => h(Consumer))
				},
			}),
		)

		const container = document.createElement('div')
		app.mount(container)

		expect(container.textContent).toBe('Name: test, Value: 42')
	})

	it('should throw error when provider is missing', () => {
		const app = createApp(
			defineComponent({
				setup() {
					expect(() => useProvider<TestData>(TEST_KEY)).toThrowError(
						`Incorrect use of provider ${TEST_KEY}. You may have forgotten to wrap it in the corresponding component.`,
					)
					return () => h('div')
				},
			}),
		)

		const container = document.createElement('div')
		app.mount(container)
	})

	it('should work with different provider keys', () => {
		const KEY_A = 'provider-a'
		const KEY_B = 'provider-b'
		const dataA = { id: 'a' }
		const dataB = { id: 'b' }

		const Provider = defineComponent({
			setup(_, { slots }) {
				provide(KEY_A, dataA)
				provide(KEY_B, dataB)
				return () => h('div', slots.default?.())
			},
		})

		const Consumer = defineComponent({
			setup() {
				const a = useProvider<typeof dataA>(KEY_A)
				const b = useProvider<typeof dataB>(KEY_B)

				expect(a.id).toBe('a')
				expect(b.id).toBe('b')

				return () => h('div', `A: ${a.id}, B: ${b.id}`)
			},
		})

		const app = createApp(
			defineComponent({
				render() {
					return h(Provider, {}, () => h(Consumer))
				},
			}),
		)

		const container = document.createElement('div')
		app.mount(container)

		expect(container.textContent).toBe('A: a, B: b')
	})

	it('should return non-nullable type', () => {
		const testData: TestData = { name: 'test', value: 100 }

		const Component = defineComponent({
			setup() {
				provide(TEST_KEY, testData)
				return () => h('div')
			},
		})

		const Consumer = defineComponent({
			setup() {
				const data = useProvider<TestData>(TEST_KEY)
				const name: string = data.name
				const value: number = data.value

				expect(name).toBe('test')
				expect(value).toBe(100)

				return () => h('div')
			},
		})

		const app = createApp(
			defineComponent({
				render() {
					return h(Component, {}, () => h(Consumer))
				},
			}),
		)

		const container = document.createElement('div')
		app.mount(container)
	})

	it('should handle reactive data updates', async () => {
		const { ref, defineComponent, h, provide } = await import('vue')

		const data = ref<TestData>({ name: 'initial', value: 0 })

		const Provider = defineComponent({
			setup(_, { slots }) {
				provide(TEST_KEY, data.value)
				return () => h('div', slots.default?.())
			},
		})

		const Consumer = defineComponent({
			setup() {
				const injected = useProvider<TestData>(TEST_KEY)
				return () => h('div', `Value: ${injected.value}`)
			},
		})

		const app = createApp(
			defineComponent({
				render() {
					return h(Provider, {}, () => h(Consumer))
				},
			}),
		)

		const container = document.createElement('div')
		app.mount(container)

		expect(container.textContent).toBe('Value: 0')
	})
})
