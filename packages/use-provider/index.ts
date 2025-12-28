import { inject } from 'vue'

export const useProvider = <TProviderData>(
	providerKey: string,
): NonNullable<TProviderData> => {
	const ctx = inject<TProviderData>(providerKey)

	if (!ctx) {
		throw new Error(
			`Incorrect use of provider ${providerKey}. You may have forgotten to wrap it in the corresponding component.`,
		)
	}

	return ctx
}
