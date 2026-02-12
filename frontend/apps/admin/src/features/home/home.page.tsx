import { useAdminStore } from "@/store/admin-store";

export function HomePage() {
	const { me } = useAdminStore();

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-semibold">欢迎</h1>
			<p className="text-muted-foreground">
				{me?.user?.nickname ?? me?.user?.email ?? "用户"}，欢迎使用后台管理系统。
			</p>
		</div>
	);
}
