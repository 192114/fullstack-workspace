import type { ReactNode } from "react";

export interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className="min-h-screen bg-gray-100">
			<main>{children}</main>
		</div>
	);
}
