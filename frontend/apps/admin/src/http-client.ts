import { createHttpClient } from "@repo/http-client";
import { tokenStore } from "./auth/token-store";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";

export const httpClient = createHttpClient({
	baseURL,
	getAccessToken: () => tokenStore.getAccessToken(),
	getRefreshToken: () => tokenStore.getRefreshToken(),
	setTokens: (access, refresh) => tokenStore.setTokens(access, refresh),
	clearTokens: () => tokenStore.clearTokens(),
	refreshEndpoint: "/api/auth/refresh",
	onUnauthorized: () => {
		window.location.href = "/login";
	},
});
