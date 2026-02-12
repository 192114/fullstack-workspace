import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";
import { createRefreshQueue, SKIP_AUTH_REFRESH_KEY } from "./refresh-queue.js";
import type { ApiResult, HttpClientConfig, RefreshTokenResponse } from "./types.js";
import { ApiError } from "./types.js";

const CONTENT_TYPE_JSON = "application/json";

function isFormData(value: unknown): value is FormData {
	return typeof FormData !== "undefined" && value instanceof FormData;
}

export function createHttpClient(config: HttpClientConfig) {
	const instance: AxiosInstance = axios.create({
		baseURL: config.baseURL,
		timeout: 30000,
		headers: {
			"Content-Type": CONTENT_TYPE_JSON,
		},
	});

	const refreshQueue = createRefreshQueue({
		refreshEndpoint: config.refreshEndpoint,
		setTokens: config.setTokens,
		clearTokens: config.clearTokens,
		onUnauthorized: config.onUnauthorized,
	});

	instance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
		const isRefresh = req[SKIP_AUTH_REFRESH_KEY as keyof InternalAxiosRequestConfig];
		if (!isRefresh) {
			const token = config.getAccessToken();
			if (token) {
				req.headers.Authorization = `Bearer ${token}`;
			}
		}

		if (isFormData(req.data)) {
			delete req.headers["Content-Type"];
		} else {
			req.headers["Content-Type"] = req.headers["Content-Type"] ?? CONTENT_TYPE_JSON;
		}

		return req;
	});

	instance.interceptors.response.use(
		(response) => {
			const wrapper = response.data as ApiResult<unknown>;
			if (typeof wrapper === "object" && wrapper !== null && "code" in wrapper) {
				if (wrapper.code !== 0) {
					throw new ApiError(wrapper.code, wrapper.message, wrapper.data);
				}
				response.data = wrapper.data;
			}
			return response;
		},
		async (error) => {
			const status = error.response?.status;
			if (status !== 401) {
				const data = error.response?.data as ApiResult<unknown> | undefined;
				if (data && typeof data === "object" && "code" in data && "message" in data) {
					throw new ApiError(data.code, data.message, data.data);
				}
				return Promise.reject(error);
			}

			const originalConfig = error.config as InternalAxiosRequestConfig;
			if (refreshQueue.isRefreshRequest(originalConfig)) {
				config.clearTokens();
				config.onUnauthorized();
				return Promise.reject(new Error("Refresh token expired"));
			}

			const doRefresh = async (): Promise<RefreshTokenResponse> => {
				const refreshToken = config.getRefreshToken();
				if (!refreshToken) {
					throw new Error("No refresh token");
				}

				const res = await instance.post<RefreshTokenResponse>(
					config.refreshEndpoint,
					{ refreshToken },
					{
						[SKIP_AUTH_REFRESH_KEY]: true,
						headers: { "Content-Type": CONTENT_TYPE_JSON },
					} as unknown as InternalAxiosRequestConfig,
				);

				const body = res.data as unknown;
				if (
					typeof body === "object" &&
					body !== null &&
					"accessToken" in body &&
					"refreshToken" in body
				) {
					const data = body as RefreshTokenResponse;
					if (data.accessToken && data.refreshToken) {
						return data;
					}
				}
				throw new Error("Invalid refresh response");
			};

			return refreshQueue.handle401(originalConfig, instance, doRefresh);
		},
	);

	function request<T>(cfg: AxiosRequestConfig): Promise<T> {
		return instance.request(cfg).then((res) => res.data as T);
	}

	return {
		get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
			return request<T>({ method: "GET", url, params });
		},

		post<T>(url: string, data?: unknown, cfg?: AxiosRequestConfig): Promise<T> {
			return request<T>({ ...cfg, method: "POST", url, data });
		},

		put<T>(url: string, data?: unknown, cfg?: AxiosRequestConfig): Promise<T> {
			return request<T>({ ...cfg, method: "PUT", url, data });
		},

		patch<T>(url: string, data?: unknown, cfg?: AxiosRequestConfig): Promise<T> {
			return request<T>({ ...cfg, method: "PATCH", url, data });
		},

		delete<T>(url: string, params?: Record<string, unknown>): Promise<T> {
			return request<T>({ method: "DELETE", url, params });
		},

		request<T>(cfg: AxiosRequestConfig): Promise<T> {
			return request<T>(cfg);
		},
	};
}
