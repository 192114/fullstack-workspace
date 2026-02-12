const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

let accessToken: string | null = null;
let refreshToken: string | null = null;

function loadFromStorage() {
	if (typeof window !== "undefined") {
		accessToken ??= localStorage.getItem(ACCESS_KEY);
		refreshToken ??= localStorage.getItem(REFRESH_KEY);
	}
}

export const tokenStore = {
	getAccessToken: (): string | null => {
		loadFromStorage();
		return accessToken;
	},
	getRefreshToken: (): string | null => {
		loadFromStorage();
		return refreshToken;
	},
	setTokens: (access: string, refresh: string) => {
		accessToken = access;
		refreshToken = refresh;
		if (typeof window !== "undefined") {
			localStorage.setItem(ACCESS_KEY, access);
			localStorage.setItem(REFRESH_KEY, refresh);
		}
	},
	clearTokens: () => {
		accessToken = null;
		refreshToken = null;
		if (typeof window !== "undefined") {
			localStorage.removeItem(ACCESS_KEY);
			localStorage.removeItem(REFRESH_KEY);
		}
	},
};
