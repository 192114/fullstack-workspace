import { useState } from "react";

export function HomePage() {
	const [count, setCount] = useState(0);

	return (
		<div className="flex flex-col items-center justify-center p-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-4">React + Vite + Tailwind</h1>
			<button
				type="button"
				className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				onClick={() => setCount((c) => c + 1)}
			>
				Count: {count}
			</button>
		</div>
	);
}
