import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "@/api/admin-user.api";
import { roleApi } from "@/api/role.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserFormPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isNew = !id;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [nickname, setNickname] = useState("");
	const [status, setStatus] = useState(1);
	const [roleIds, setRoleIds] = useState<Set<number>>(new Set());

	const { data: user } = useQuery({
		queryKey: ["admin-user", id],
		queryFn: () => adminUserApi.getById(Number(id)),
		enabled: !isNew && !!id,
	});

	const { data: rolesData } = useQuery({
		queryKey: ["roles", "all"],
		queryFn: () => roleApi.list({ page: 1, pageSize: 100 }),
	});

	const { data: userRoles } = useQuery({
		queryKey: ["admin-user", id, "roles"],
		queryFn: () => adminUserApi.getRoles(Number(id)),
		enabled: !isNew && !!id,
	});

	useEffect(() => {
		if (user) {
			setEmail(user.email ?? "");
			setNickname(user.nickname ?? "");
			setStatus(user.status ?? 1);
		}
	}, [user]);

	useEffect(() => {
		if (userRoles) setRoleIds(new Set(userRoles));
	}, [userRoles]);

	const roles = rolesData?.list ?? [];

	const createMutation = useMutation({
		mutationFn: () =>
			adminUserApi.create({
				email,
				password,
				nickname,
				status,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			navigate("/users");
		},
	});

	const updateMutation = useMutation({
		mutationFn: () =>
			Promise.all([
				adminUserApi.update(Number(id), { nickname, status }),
				adminUserApi.assignRoles(Number(id), { roleIds: [...roleIds] }),
			]),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
			navigate("/users");
		},
	});

	const toggleRole = (roleId: number) => {
		setRoleIds((prev) => {
			const next = new Set(prev);
			if (next.has(roleId)) next.delete(roleId);
			else next.add(roleId);
			return next;
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isNew) createMutation.mutate();
		else updateMutation.mutate();
	};

	const isPending = createMutation.isPending || updateMutation.isPending;
	const error = (createMutation.error ?? updateMutation.error) as Error | undefined;

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/users">
						<ChevronLeft className="size-4" />
					</Link>
				</Button>
				<h1 className="text-2xl font-semibold">{isNew ? "新建用户" : "编辑用户"}</h1>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>基本信息</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">邮箱</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={!isNew}
							/>
						</div>
						{isNew && (
							<div className="space-y-2">
								<Label htmlFor="password">密码</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
						)}
						<div className="space-y-2">
							<Label htmlFor="nickname">昵称</Label>
							<Input
								id="nickname"
								value={nickname}
								onChange={(e) => setNickname(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status">状态</Label>
							<select
								id="status"
								value={status}
								onChange={(e) => setStatus(Number(e.target.value))}
								className={cn(
									"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
								)}
							>
								<option value={1}>启用</option>
								<option value={0}>禁用</option>
							</select>
						</div>
					</CardContent>
				</Card>
				{!isNew && (
					<Card>
						<CardHeader>角色分配</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-4">
								{roles.map((role) => (
									<label key={role.id} className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={roleIds.has(role.id ?? 0)}
											onChange={() => toggleRole(role.id ?? 0)}
											className="rounded"
										/>
										<span>{role.name}</span>
									</label>
								))}
							</div>
						</CardContent>
					</Card>
				)}
				{error && <p className="text-destructive text-sm">{error.message}</p>}
				<div className="flex gap-2">
					<Button type="submit" disabled={isPending}>
						{isPending ? "保存中..." : "保存"}
					</Button>
					<Button type="button" variant="outline" asChild>
						<Link to="/users">取消</Link>
					</Button>
				</div>
			</form>
		</div>
	);
}
