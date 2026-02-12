import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { tokenStore } from "@/auth/token-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOGIN_TYPE = { PASSWORD: "1", CODE: "2" } as const;

export function LoginPage() {
	const navigate = useNavigate();
	const [loginType, setLoginType] = useState<"1" | "2">(LOGIN_TYPE.PASSWORD);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailCode, setEmailCode] = useState("");

	const sendCodeMutation = useMutation({
		mutationFn: () =>
			authApi.sendEmail({ email, usage: "2" }),
	});

	const loginMutation = useMutation({
		mutationFn: () =>
			authApi.login({
				loginType,
				email,
				...(loginType === LOGIN_TYPE.PASSWORD ? { password } : { emailCode }),
			}),
		onSuccess: (data) => {
			if (data?.accessToken && data?.refreshToken) {
				tokenStore.setTokens(data.accessToken, data.refreshToken);
				navigate("/dashboard", { replace: true });
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate();
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold">后台管理系统</h1>
				<p className="text-muted-foreground text-sm">登录</p>
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
				{loginType === LOGIN_TYPE.PASSWORD ? (
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
				) : (
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
				)}
				<Button
					type="button"
					variant="link"
					className="text-muted-foreground text-sm"
					onClick={() =>
						setLoginType(loginType === LOGIN_TYPE.PASSWORD ? LOGIN_TYPE.CODE : LOGIN_TYPE.PASSWORD)
					}
				>
					{loginType === LOGIN_TYPE.PASSWORD ? "使用验证码登录" : "使用密码登录"}
				</Button>
				{loginMutation.isError && (
					<p className="text-destructive text-sm">
						{(loginMutation.error as Error).message}
					</p>
				)}
				<Button type="submit" className="w-full" disabled={loginMutation.isPending}>
					{loginMutation.isPending ? "登录中..." : "登录"}
				</Button>
			</form>
			<p className="text-center text-muted-foreground text-sm">
				<Link to="/register" className="underline hover:text-primary">
					注册
				</Link>
				{" · "}
				<Link to="/forgot-password" className="underline hover:text-primary">
					忘记密码
				</Link>
			</p>
		</div>
	);
}
