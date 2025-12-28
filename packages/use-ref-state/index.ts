import { ref, readonly, type Ref } from 'vue'

type StateSetterFn<T> = (setter: T) => T

const setterIsFunction = <T>(
	value: T | StateSetterFn<T>,
): value is StateSetterFn<T> => typeof value === 'function'

function useRefState<TState>(
	initialValue?: TState,
	asReadonly?: true,
): [Readonly<Ref<TState>>, (setter: TState | StateSetterFn<TState>) => void]
function useRefState<TState>(
	initialValue?: TState,
	asReadonly?: false,
): [Ref<TState>, (setter: TState | StateSetterFn<TState>) => void]
function useRefState<TState>(initialValue?: TState, asReadonly = true) {
	const state = ref(initialValue)

	const setState = (setter: TState | StateSetterFn<TState>) => {
		if (setterIsFunction(setter)) {
			state.value = setter(state.value)
		} else {
			state.value = setter
		}
	}

	return [asReadonly ? readonly(state) : state, setState]
}

export { useRefState }
