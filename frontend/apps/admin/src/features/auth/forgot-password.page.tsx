import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordPage() {
	const [email, setEmail] = useState("");

	const mutation = useMutation({
		mutationFn: () =>
			authApi.forgotPassword({ email }),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate();
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold">忘记密码</h1>
				<p className="text-muted-foreground text-sm">输入邮箱，我们将发送重置链接</p>
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
				{mutation.isSuccess && (
					<p className="text-muted-foreground text-sm">验证码已发送，请查收邮件</p>
				)}
				{mutation.isError && (
					<p className="text-destructive text-sm">
						{(mutation.error as Error).message}
					</p>
				)}
				<Button type="submit" className="w-full" disabled={mutation.isPending}>
					{mutation.isPending ? "发送中..." : "发送验证码"}
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
