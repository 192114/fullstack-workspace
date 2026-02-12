<script setup lang="ts">
import { ref } from "vue";

// biome-ignore lint/correctness/noUnusedVariables: used in template
const count = ref(0);
</script>

<template>
	<div class="flex flex-col items-center justify-center p-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Vue + Vite + Tailwind</h1>
		<button
			type="button"
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			@click="count++"
		>
			Count: {{ count }}
		</button>
	</div>
</template>
