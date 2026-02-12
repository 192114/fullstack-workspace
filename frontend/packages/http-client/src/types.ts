/** 配置 createHttpClient 所需的参数 */
export interface HttpClientConfig {
	baseURL: string;
	getAccessToken: () => string | null;
	setTokens: (access: string, refresh: string) => void;
	getRefreshToken: () => string | null;
	clearTokens: () => void;
	refreshEndpoint: string;
	onUnauthorized: () => void;
}

/** 后端 ApiResult 封装，与 api-client 约定一致 */
export interface ApiResult<T> {
	code: number;
	message: string;
	data: T;
}

/** 业务请求失败时抛出的错误 */
export class ApiError extends Error {
	constructor(
		public readonly code: number,
		message: string,
		public readonly data?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

/** refresh 接口成功时的响应结构（按需扩展） */
export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
}
