import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface AuthLayoutProps {
	children?: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4">
			<Card className="w-full max-w-md">
				<CardHeader />
				<CardContent>{children ?? <Outlet />}</CardContent>
			</Card>
		</div>
	);
}
