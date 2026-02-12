import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthGuard } from "../components/auth-guard";
import { AuthLayout } from "../layouts/auth-layout";
import { MainLayout } from "../layouts/main-layout";
import { HomePage } from "../features/home/home.page";
import { LoginPage } from "../features/auth/login.page";
import { RegisterPage } from "../features/auth/register.page";
import { ForgotPasswordPage } from "../features/auth/forgot-password.page";
import { ResetPasswordPage } from "../features/auth/reset-password.page";
import { ChangePasswordPage } from "../features/auth/change-password.page";
import { RoleListPage } from "../features/roles/role-list.page";
import { RoleFormPage } from "../features/roles/role-form.page";
import { MenuTreePage } from "../features/menus/menu-tree.page";
import { UserListPage } from "../features/users/user-list.page";
import { UserFormPage } from "../features/users/user-form.page";

export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Navigate to="/dashboard" replace />,
		},
		{
			path: "/login",
			element: (
				<AuthLayout>
					<LoginPage />
				</AuthLayout>
			),
		},
		{
			path: "/register",
			element: (
				<AuthLayout>
					<RegisterPage />
				</AuthLayout>
			),
		},
		{
			path: "/forgot-password",
			element: (
				<AuthLayout>
					<ForgotPasswordPage />
				</AuthLayout>
			),
		},
		{
			path: "/reset-password",
			element: (
				<AuthLayout>
					<ResetPasswordPage />
				</AuthLayout>
			),
		},
		{
			path: "/",
			element: (
				<AuthGuard>
					<MainLayout />
				</AuthGuard>
			),
			children: [
				{
					path: "dashboard",
					element: <HomePage />,
				},
				{
					path: "settings/change-password",
					element: <ChangePasswordPage />,
				},
				{
					path: "roles",
					element: <RoleListPage />,
				},
				{
					path: "roles/new",
					element: <RoleFormPage />,
				},
				{
					path: "roles/:id/edit",
					element: <RoleFormPage />,
				},
				{
					path: "menus",
					element: <MenuTreePage />,
				},
				{
					path: "users",
					element: <UserListPage />,
				},
				{
					path: "users/new",
					element: <UserFormPage />,
				},
				{
					path: "users/:id/edit",
					element: <UserFormPage />,
				},
			],
		},
	],
	{ basename: import.meta.env.VITE_BASE_PATH ?? "/" },
);
