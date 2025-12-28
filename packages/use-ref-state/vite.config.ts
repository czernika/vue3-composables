import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: './index.ts',
			},
			formats: ['es'],
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},

	plugins: [
		dts({
			copyDtsFiles: true,
			cleanVueFileName: true,
			rollupTypes: true,
		}),
	],
})
