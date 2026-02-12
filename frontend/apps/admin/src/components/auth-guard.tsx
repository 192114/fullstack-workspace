import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { tokenStore } from "../auth/token-store";

export interface AuthGuardProps {
	children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const location = useLocation();
	const token = tokenStore.getAccessToken();

	if (!token) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
