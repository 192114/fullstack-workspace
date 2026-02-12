import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminUserApi } from "@/api/admin-user.api";
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

export function UserListPage() {
	const [page, setPage] = useState(1);
	const [keyword, setKeyword] = useState("");
	const [status, setStatus] = useState<number | undefined>(undefined);
	const pageSize = 10;

	const { data, isLoading } = useQuery({
		queryKey: ["admin-users", page, keyword, status],
		queryFn: () =>
			adminUserApi.list({
				page,
				pageSize,
				keyword: keyword || undefined,
				status,
			}),
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">用户管理</h1>
				<Button asChild>
					<Link to="/users/new">
						<Plus className="mr-2 size-4" />
						新建用户
					</Link>
				</Button>
			</div>
			<div className="flex gap-2">
				<Input
					placeholder="搜索用户"
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					className="max-w-sm"
				/>
				<select
					value={status ?? ""}
					onChange={(e) => setStatus(e.target.value === "" ? undefined : Number(e.target.value))}
					className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
				>
					<option value="">全部状态</option>
					<option value={1}>启用</option>
					<option value={0}>禁用</option>
				</select>
			</div>
			<div className="rounded-md border">
				{isLoading ? (
					<div className="p-8 text-center text-muted-foreground">加载中...</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>邮箱</TableHead>
								<TableHead>昵称</TableHead>
								<TableHead>状态</TableHead>
								<TableHead>创建时间</TableHead>
								<TableHead className="w-20" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{[...(data?.list ?? [])].map((row) => (
								<TableRow key={row.id}>
									<TableCell>{row.id}</TableCell>
									<TableCell>{row.email}</TableCell>
									<TableCell>{row.nickname}</TableCell>
									<TableCell>{row.status === 1 ? "启用" : "禁用"}</TableCell>
									<TableCell>{row.createTime}</TableCell>
									<TableCell>
										<Button variant="ghost" size="icon" asChild>
											<Link to={`/users/${row.id}/edit`}>
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
