import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "@/api/role.api";
import { permissionApi } from "@/api/permission.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import type { PermissionTreeItem } from "@repo/api-client";
import { cn } from "@/lib/utils";

function PermissionCheckbox({
	item,
	selected,
	onToggle,
}: {
	item: PermissionTreeItem;
	selected: Set<number>;
	onToggle: (id: number) => void;
}) {
	const id = item.id ?? 0;
	const checked = selected.has(id);

	return (
		<div className="space-y-2">
			<label className="flex items-center gap-2 cursor-pointer">
				<input
					type="checkbox"
					checked={checked}
					onChange={() => onToggle(id)}
					className="rounded"
				/>
				<span>{item.name}</span>
			</label>
			{item.children && item.children.length > 0 && (
				<div className="ml-4 space-y-2">
					{item.children.map((child) => (
						<PermissionCheckbox
							key={child.id}
							item={child}
							selected={selected}
							onToggle={onToggle}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export function RoleFormPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isNew = !id;

	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState(1);
	const [permissionIds, setPermissionIds] = useState<Set<number>>(new Set());

	const { data: role } = useQuery({
		queryKey: ["role", id],
		queryFn: () => roleApi.getById(Number(id)),
		enabled: !isNew && !!id,
	});

	const { data: permissions } = useQuery({
		queryKey: ["permissions"],
		queryFn: () => permissionApi.getTree(),
	});

	const { data: rolePermissions } = useQuery({
		queryKey: ["role", id, "permissions"],
		queryFn: () => roleApi.getPermissions(Number(id)),
		enabled: !isNew && !!id,
	});

	useEffect(() => {
		if (role) {
			setName(role.name ?? "");
			setCode(role.code ?? "");
			setDescription(role.description ?? "");
			setStatus(role.status ?? 1);
		}
	}, [role]);

	useEffect(() => {
		if (rolePermissions) setPermissionIds(new Set(rolePermissions));
	}, [rolePermissions]);

	const createMutation = useMutation({
		mutationFn: () =>
			roleApi.create({
				code,
				name,
				description,
				type: 1,
				status,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles"] });
			navigate("/roles");
		},
	});

	const updateMutation = useMutation({
		mutationFn: () =>
			Promise.all([
				roleApi.update(Number(id), { name, description, status }),
				roleApi.assignPermissions(Number(id), { permissionIds: [...permissionIds] }),
			]),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles"] });
			queryClient.invalidateQueries({ queryKey: ["role", id] });
			navigate("/roles");
		},
	});

	const togglePermission = (permId: number) => {
		setPermissionIds((prev) => {
			const next = new Set(prev);
			if (next.has(permId)) next.delete(permId);
			else next.add(permId);
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
					<Link to="/roles">
						<ChevronLeft className="size-4" />
					</Link>
				</Button>
				<h1 className="text-2xl font-semibold">{isNew ? "新建角色" : "编辑角色"}</h1>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>基本信息</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="code">编码</Label>
							<Input
								id="code"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								required
								disabled={!isNew}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="name">名称</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">描述</Label>
							<Input
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						{!isNew && (
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
						)}
					</CardContent>
				</Card>
				{!isNew && permissions && (
					<Card>
						<CardHeader>权限分配</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{permissions.map((item) => (
									<PermissionCheckbox
										key={item.id}
										item={item}
										selected={permissionIds}
										onToggle={togglePermission}
									/>
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
						<Link to="/roles">取消</Link>
					</Button>
				</div>
			</form>
		</div>
	);
}
