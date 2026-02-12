/**
 * Design Tokens - TypeScript export
 * For use in JS/TS when needing token values
 */
export const tokens = {
	color: {
		primary: "#3b82f6",
		primaryHover: "#2563eb",
		primaryMuted: "#dbeafe",
		success: "#22c55e",
		warning: "#f59e0b",
		error: "#ef4444",
		muted: "#6b7280",
	},
	spacing: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
	},
	radius: {
		sm: "0.25rem",
		md: "0.375rem",
		lg: "0.5rem",
	},
} as const;
