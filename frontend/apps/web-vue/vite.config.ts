import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiPrefix = env.VITE_API_PREFIX ?? "/api";
	const proxyTarget = env.VITE_PROXY_TARGET;
	const basePath = env.VITE_BASE_PATH ?? "/";

	return {
		base: basePath,
		plugins: [tailwindcss(), vue()],
		resolve: {
			alias: { "@": resolve(__dirname, "./src") },
		},
		server: {
			proxy: proxyTarget
				? {
						[apiPrefix]: {
							target: proxyTarget,
							changeOrigin: true,
						},
					}
				: undefined,
		},
	};
});
