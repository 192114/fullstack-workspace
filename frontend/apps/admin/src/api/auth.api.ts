import { AuthContract } from "@repo/api-client";
import { httpClient } from "../http-client";

const ADMIN_HEADERS = { "X-Client-Type": "admin" } as const;

export const authApi = {
	sendEmail: (data: AuthContract.SendEmailRequest) =>
		httpClient.post<unknown>(AuthContract.email.path, data, { headers: ADMIN_HEADERS }),

	register: (data: AuthContract.RegisterRequest) =>
		httpClient.post<unknown>(AuthContract.register.path, data, { headers: ADMIN_HEADERS }),

	login: (data: AuthContract.LoginRequest) =>
		httpClient.post<AuthContract.TokenResponse>(AuthContract.login.path, data, { headers: ADMIN_HEADERS }),

	logout: (data?: AuthContract.LogoutRequest) =>
		httpClient.post<unknown>(AuthContract.logout.path, data ?? {}),

	changePassword: (data: AuthContract.ChangePasswordRequest) =>
		httpClient.post<unknown>(AuthContract.changePassword.path, data),

	forgotPassword: (data: AuthContract.ForgotPasswordRequest) =>
		httpClient.post<unknown>(AuthContract.forgotPassword.path, data, { headers: ADMIN_HEADERS }),

	resetPassword: (data: AuthContract.ResetPasswordRequest) =>
		httpClient.post<unknown>(AuthContract.resetPassword.path, data, { headers: ADMIN_HEADERS }),

	me: () => httpClient.get<import("@repo/api-client").UserMe>(AuthContract.me.path),
};
