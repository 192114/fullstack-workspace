import { useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LogOut, LayoutDashboard, Users, Shield, Menu } from "lucide-react";
import { adminMeApi } from "@/api/admin-me.api";
import { authApi } from "@/api/auth.api";
import { tokenStore } from "@/auth/token-store";
import { useAdminStore } from "@/store/admin-store";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MenuTreeItem } from "@repo/api-client";
import { cn } from "@/lib/utils";

const DEFAULT_MENUS: MenuTreeItem[] = [
	{ id: 1, name: "首页", path: "/dashboard", icon: "LayoutDashboard" },
	{ id: 2, name: "角色管理", path: "/roles", icon: "Shield" },
	{ id: 3, name: "菜单管理", path: "/menus", icon: "Menu" },
	{ id: 4, name: "用户管理", path: "/users", icon: "Users" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	LayoutDashboard,
	Shield,
	Menu,
	Users,
};

function MenuItem({ item }: { item: MenuTreeItem }) {
	const Icon = item.icon ? iconMap[item.icon] ?? LayoutDashboard : LayoutDashboard;
	const path = item.path ?? "#";

	if (item.children && item.children.length > 0) {
		return (
			<div className="space-y-1">
				<div className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
					<Icon className="size-4" />
					<span>{item.name}</span>
				</div>
				<div className="ml-4 space-y-1">
					{item.children.map((child) => (
						<MenuItem key={child.id} item={child} />
					))}
				</div>
			</div>
		);
	}

	return (
		<Link
			to={path}
			className={cn(
				"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
				"data-[active]:bg-accent data-[active]:text-accent-foreground",
			)}
		>
			<Icon className="size-4" />
			<span>{item.name}</span>
		</Link>
	);
}

export function MainLayout() {
	const navigate = useNavigate();
	const { me, setMe } = useAdminStore();

	const { data, isLoading } = useQuery({
		queryKey: ["admin", "me"],
		queryFn: () => adminMeApi.getMe(),
		enabled: !!tokenStore.getAccessToken(),
	});

	useEffect(() => {
		if (data) setMe(data);
		return () => setMe(null);
	}, [data, setMe]);

	const handleLogout = async () => {
		try {
			await authApi.logout();
		} finally {
			tokenStore.clearTokens();
			setMe(null);
			navigate("/login", { replace: true });
		}
	};

	const menus = me?.menus && me.menus.length > 0 ? me.menus : DEFAULT_MENUS;

	return (
		<div className="flex min-h-svh">
			<aside className="w-56 border-r bg-card">
				<div className="flex h-14 items-center border-b px-4">
					<span className="font-semibold">Admin</span>
				</div>
				<nav className="space-y-1 p-2">
					{menus.map((item) => (
						<MenuItem key={item.id} item={item} />
					))}
				</nav>
			</aside>
			<div className="flex flex-1 flex-col">
				<header className="flex h-14 items-center justify-between border-b px-4">
					<div />
					<div className="flex items-center gap-2">
						{isLoading ? (
							<span className="text-muted-foreground text-sm">加载中...</span>
						) : (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										{me?.user?.nickname ?? me?.user?.email ?? "用户"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem asChild>
										<Link to="/settings/change-password">修改密码</Link>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="mr-2 size-4" />
										退出登录
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</header>
				<main className="flex-1 overflow-auto bg-muted/30 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
