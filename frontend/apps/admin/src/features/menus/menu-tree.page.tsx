import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "@/api/menu.api";
import { permissionApi } from "@/api/permission.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ChevronRight, ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import type { MenuManagementTreeItem } from "@repo/api-client";

function MenuRow({
	item,
	level,
	onEdit,
	onDelete,
}: {
	item: MenuManagementTreeItem;
	level: number;
	onEdit: (item: MenuManagementTreeItem) => void;
	onDelete: (item: MenuManagementTreeItem) => void;
}) {
	const [expanded, setExpanded] = useState(true);
	const hasChildren = item.children && item.children.length > 0;

	return (
		<>
			<TableRow>
				<TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
					<div className="flex items-center gap-1">
						{hasChildren ? (
							<button
								type="button"
								onClick={() => setExpanded(!expanded)}
								className="p-0"
							>
								{expanded ? (
									<ChevronDown className="size-4" />
								) : (
									<ChevronRight className="size-4" />
								)}
							</button>
						) : (
							<span className="w-4" />
						)}
						<span>{item.name}</span>
					</div>
				</TableCell>
				<TableCell>{item.path}</TableCell>
				<TableCell>{item.component}</TableCell>
				<TableCell>{item.visible === 1 ? "显示" : "隐藏"}</TableCell>
				<TableCell>
					<div className="flex gap-1">
						<Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
							<Pencil className="size-4" />
						</Button>
						<Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
							<Trash2 className="size-4 text-destructive" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
			{hasChildren && expanded &&
				item.children!.map((child) => (
					<MenuRow
						key={child.id}
						item={child}
						level={level + 1}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				))}
		</>
	);
}

export function MenuTreePage() {
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<MenuManagementTreeItem | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<MenuManagementTreeItem | null>(null);

	const [name, setName] = useState("");
	const [path, setPath] = useState("");
	const [component, setComponent] = useState("");
	const [parentId, setParentId] = useState(0);
	const [permissionId, setPermissionId] = useState(0);
	const [sortOrder, setSortOrder] = useState(0);
	const [visible, setVisible] = useState(1);

	const { data: tree, isLoading } = useQuery({
		queryKey: ["menus"],
		queryFn: () => menuApi.getTree(),
	});

	const { data: permissions } = useQuery({
		queryKey: ["permissions"],
		queryFn: () => permissionApi.getTree(),
	});

	const createMutation = useMutation({
		mutationFn: () =>
			menuApi.create({
				parentId,
				permissionId,
				name,
				path,
				component,
				sortOrder,
				visible,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["menus"] });
			resetForm();
			setDialogOpen(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: () =>
			menuApi.update(editing!.id!, {
				name,
				path,
				component,
				sortOrder,
				visible,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["menus"] });
			resetForm();
			setDialogOpen(false);
			setEditing(null);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => menuApi.delete(deleteTarget!.id!),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["menus"] });
			setDeleteTarget(null);
		},
	});

	function resetForm() {
		setName("");
		setPath("");
		setComponent("");
		setParentId(0);
		setPermissionId(0);
		setSortOrder(0);
		setVisible(1);
	}

	function openCreate(parent?: MenuManagementTreeItem) {
		setEditing(null);
		setParentId(parent?.id ?? 0);
		setPermissionId(0);
		resetForm();
		setDialogOpen(true);
	}

	function openEdit(item: MenuManagementTreeItem) {
		setEditing(item);
		setName(item.name ?? "");
		setPath(item.path ?? "");
		setComponent(item.component ?? "");
		setParentId(item.parentId ?? 0);
		setPermissionId(item.permissionId ?? 0);
		setSortOrder(item.sortOrder ?? 0);
		setVisible(item.visible ?? 1);
		setDialogOpen(true);
	}

	function flattenMenu(items: MenuManagementTreeItem[]): MenuManagementTreeItem[] {
		const result: MenuManagementTreeItem[] = [];
		for (const item of items) {
			result.push(item);
			if (item.children?.length) result.push(...flattenMenu(item.children));
		}
		return result;
	}

	function flattenPermissions(
		items: import("@repo/api-client").PermissionTreeItem[],
	): import("@repo/api-client").PermissionTreeItem[] {
		const result: import("@repo/api-client").PermissionTreeItem[] = [];
		for (const item of items) {
			result.push(item);
			if (item.children?.length) result.push(...flattenPermissions(item.children));
		}
		return result;
	}

	const menuParentOptions = tree ? flattenMenu(tree) : [];
	const permissionOptions = permissions ? flattenPermissions(permissions) : [];

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">菜单管理</h1>
				<Button onClick={() => openCreate()}>
					<Plus className="mr-2 size-4" />
					新建菜单
				</Button>
			</div>
			<div className="rounded-md border">
				{isLoading ? (
					<div className="p-8 text-center text-muted-foreground">加载中...</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>名称</TableHead>
								<TableHead>路径</TableHead>
								<TableHead>组件</TableHead>
								<TableHead>可见</TableHead>
								<TableHead className="w-20" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{(tree ?? []).map((item) => (
								<MenuRow
									key={item.id}
									item={item}
									level={0}
									onEdit={openEdit}
									onDelete={setDeleteTarget}
								/>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{editing ? "编辑菜单" : "新建菜单"}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
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
							<Label htmlFor="path">路径</Label>
							<Input id="path" value={path} onChange={(e) => setPath(e.target.value)} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="component">组件</Label>
							<Input
								id="component"
								value={component}
								onChange={(e) => setComponent(e.target.value)}
							/>
						</div>
						{!editing && (
							<>
								<div className="space-y-2">
									<Label htmlFor="parentId">父级菜单</Label>
									<select
										id="parentId"
										value={parentId}
										onChange={(e) => setParentId(Number(e.target.value))}
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
									>
										<option value={0}>无（根级）</option>
										{menuParentOptions.map((m) => (
											<option key={m.id} value={m.id}>
												{m.name}
											</option>
										))}
									</select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="permissionId">关联权限</Label>
									<select
										id="permissionId"
										value={permissionId}
										onChange={(e) => setPermissionId(Number(e.target.value))}
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
									>
										<option value={0}>无</option>
										{permissionOptions.map((p) => (
											<option key={p.id} value={p.id ?? 0}>
												{p.name}
											</option>
										))}
									</select>
								</div>
							</>
						)}
						<div className="space-y-2">
							<Label htmlFor="visible">可见</Label>
							<select
								id="visible"
								value={visible}
								onChange={(e) => setVisible(Number(e.target.value))}
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
							>
								<option value={1}>显示</option>
								<option value={0}>隐藏</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							取消
						</Button>
						<Button
							onClick={() => (editing ? updateMutation.mutate() : createMutation.mutate())}
							disabled={createMutation.isPending || updateMutation.isPending}
						>
							保存
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>确认删除</DialogTitle>
					</DialogHeader>
					<p>确定要删除菜单「{deleteTarget?.name}」吗？</p>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteTarget(null)}>
							取消
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteMutation.mutate()}
							disabled={deleteMutation.isPending}
						>
							删除
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
