import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { roleApi } from "@/api/role.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";

export function RoleListPage() {
	const [page, setPage] = useState(1);
	const [keyword, setKeyword] = useState("");
	const pageSize = 10;

	const { data, isLoading } = useQuery({
		queryKey: ["roles", page, keyword],
		queryFn: () => roleApi.list({ page, pageSize, keyword: keyword || undefined }),
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">角色管理</h1>
				<Button asChild>
					<Link to="/roles/new">
						<Plus className="mr-2 size-4" />
						新建角色
					</Link>
				</Button>
			</div>
			<div className="flex gap-2">
				<Input
					placeholder="搜索角色"
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				{isLoading ? (
					<div className="p-8 text-center text-muted-foreground">加载中...</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>编码</TableHead>
								<TableHead>名称</TableHead>
								<TableHead>描述</TableHead>
								<TableHead>状态</TableHead>
								<TableHead className="w-20" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{[...(data?.list ?? [])].map((row) => (
								<TableRow key={row.id}>
									<TableCell>{row.id}</TableCell>
									<TableCell>{row.code}</TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{row.description}</TableCell>
									<TableCell>{row.status === 1 ? "启用" : "禁用"}</TableCell>
									<TableCell>
										<Button variant="ghost" size="icon" asChild>
											<Link to={`/roles/${row.id}/edit`}>
												<Pencil className="size-4" />
											</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{data && (data.total ?? 0) > pageSize && (
				<div className="flex justify-end gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => setPage((p) => p - 1)}
					>
						上一页
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={page * pageSize >= (data.total ?? 0)}
						onClick={() => setPage((p) => p + 1)}
					>
						下一页
					</Button>
				</div>
			)}
		</div>
	);
}
