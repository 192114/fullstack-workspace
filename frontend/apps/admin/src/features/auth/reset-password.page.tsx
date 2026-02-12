import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [emailCode, setEmailCode] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const sendCodeMutation = useMutation({
		mutationFn: () =>
			authApi.sendEmail({ email, usage: "3" }),
	});

	const resetMutation = useMutation({
		mutationFn: () =>
			authApi.resetPassword({ email, emailCode, newPassword }),
		onSuccess: () => {
			navigate("/login", { replace: true });
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		resetMutation.mutate();
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold">重置密码</h1>
				<p className="text-muted-foreground text-sm">输入邮箱、验证码和新密码</p>
			</div>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="email">邮箱</Label>
					<Input
						id="email"
						type="email"
						placeholder="name@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="code">验证码</Label>
					<div className="flex gap-2">
						<Input
							id="code"
							placeholder="验证码"
							value={emailCode}
							onChange={(e) => setEmailCode(e.target.value)}
							required
						/>
						<Button
							type="button"
							variant="outline"
							onClick={() => sendCodeMutation.mutate()}
							disabled={sendCodeMutation.isPending || !email}
						>
							{sendCodeMutation.isPending ? "发送中" : "发送验证码"}
						</Button>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="newPassword">新密码</Label>
					<Input
						id="newPassword"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
				</div>
				{resetMutation.isError && (
					<p className="text-destructive text-sm">
						{(resetMutation.error as Error).message}
					</p>
				)}
				<Button type="submit" className="w-full" disabled={resetMutation.isPending}>
					{resetMutation.isPending ? "重置中..." : "重置密码"}
				</Button>
			</form>
			<p className="text-center text-muted-foreground text-sm">
				<Link to="/login" className="underline hover:text-primary">
					返回登录
				</Link>
			</p>
		</div>
	);
}
