import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
	const base = "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50";
	const variants = {
		primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
		secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
		outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
	};
	return (
		<button type="button" className={`${base} ${variants[variant]} ${className}`} {...props} />
	);
}
