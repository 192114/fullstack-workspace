import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordPage() {
	const [useCode, setUseCode] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [email, setEmail] = useState("");
	const [emailCode, setEmailCode] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const sendCodeMutation = useMutation({
		mutationFn: () =>
			authApi.sendEmail({ email, usage: "3" }),
	});

	const changeMutation = useMutation({
		mutationFn: () =>
			authApi.changePassword({
				...(useCode ? { emailCode } : { oldPassword }),
				newPassword,
			}),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		changeMutation.mutate();
	};

	return (
		<div className="mx-auto max-w-md p-6">
			<Card>
				<CardHeader>
					<h1 className="text-xl font-semibold">修改密码</h1>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<Button
							type="button"
							variant="link"
							className="text-muted-foreground text-sm"
							onClick={() => setUseCode(!useCode)}
						>
							{useCode ? "使用旧密码" : "使用验证码"}
						</Button>
						{useCode ? (
							<>
								<div className="space-y-2">
									<Label htmlFor="email">邮箱</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="emailCode">验证码</Label>
									<div className="flex gap-2">
										<Input
											id="emailCode"
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
							</>
						) : (
							<div className="space-y-2">
								<Label htmlFor="oldPassword">旧密码</Label>
								<Input
									id="oldPassword"
									type="password"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
									required
								/>
							</div>
						)}
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
						{changeMutation.isError && (
							<p className="text-destructive text-sm">
								{(changeMutation.error as Error).message}
							</p>
						)}
						{changeMutation.isSuccess && (
							<p className="text-muted-foreground text-sm">密码修改成功</p>
						)}
						<Button type="submit" className="w-full" disabled={changeMutation.isPending}>
							{changeMutation.isPending ? "修改中..." : "修改密码"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
