import type { ReactNode } from "react";

export interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
		>
			<button
				type="button"
				className="absolute inset-0 w-full h-full bg-black/50 cursor-default border-0 p-0"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				aria-label="Close modal"
			/>
			<div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
				{title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
				{children}
			</div>
		</div>
	);
}
