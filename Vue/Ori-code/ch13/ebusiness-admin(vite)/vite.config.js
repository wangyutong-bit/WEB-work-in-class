import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"comps": path.resolve(__dirname, "./src/components"),
			"views": path.resolve(__dirname, "./src/views"),
			"routes": path.resolve(__dirname, "./src/routes"),
			"styles": path.resolve(__dirname, "./src/styles"),
		},
	},
	define: {
		//不加这个定义，router/index.js将提示process.env.BASE_URL未定义
		'process.env': {}
	},
	base: "./",
	/**
	 * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
	 * @default 'dist'
	 */
	outDir: "dist",
	server: {
		port: 8000
	},
})
