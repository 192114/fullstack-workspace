import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const SKIP_AUTH_REFRESH_KEY = "_skipAuthRefresh";

export interface RefreshQueueConfig {
	refreshEndpoint: string;
	setTokens: (access: string, refresh: string) => void;
	clearTokens: () => void;
	onUnauthorized: () => void;
}

export interface QueuedRequest {
	config: InternalAxiosRequestConfig;
	resolve: (value: unknown) => void;
	reject: (reason?: unknown) => void;
}

export function createRefreshQueue(axiosConfig: RefreshQueueConfig) {
	let refreshPromise: Promise<void> | null = null;
	const queue: QueuedRequest[] = [];

	function isRefreshRequest(config: InternalAxiosRequestConfig): boolean {
		const url = config.url ?? "";
		const baseURL = config.baseURL ?? "";
		const fullPath = url.startsWith("http") ? url : `${baseURL}${url}`;
		return fullPath.includes(axiosConfig.refreshEndpoint);
	}

	function failAll(reason: unknown) {
		for (const { reject } of queue) {
			reject(reason);
		}
		queue.length = 0;
	}

	function retryAll(instance: AxiosInstance) {
		const copy = [...queue];
		queue.length = 0;
		for (const { config, resolve, reject } of copy) {
			instance.request(config).then(resolve).catch(reject);
		}
	}

	async function runRefresh(
		instance: AxiosInstance,
		doRefresh: () => Promise<{ accessToken: string; refreshToken: string }>,
	): Promise<void> {
		try {
			const { accessToken, refreshToken } = await doRefresh();
			axiosConfig.setTokens(accessToken, refreshToken);
			retryAll(instance);
		} catch {
			axiosConfig.clearTokens();
			axiosConfig.onUnauthorized();
			failAll(new Error("Refresh token failed"));
		} finally {
			refreshPromise = null;
		}
	}

	function handle401(
		config: InternalAxiosRequestConfig,
		instance: AxiosInstance,
		doRefresh: () => Promise<{ accessToken: string; refreshToken: string }>,
	): Promise<unknown> {
		if (config[SKIP_AUTH_REFRESH_KEY as keyof InternalAxiosRequestConfig]) {
			axiosConfig.clearTokens();
			axiosConfig.onUnauthorized();
			return Promise.reject(new Error("Refresh token expired"));
		}

		return new Promise((resolve, reject) => {
			queue.push({ config, resolve, reject });

			if (!refreshPromise) {
				refreshPromise = runRefresh(instance, doRefresh);
			}
		});
	}

	return {
		isRefreshRequest,
		handle401,
	};
}
