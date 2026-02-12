<script setup lang="ts">
defineOptions({
	name: "MainLayout",
});
</script>

<template>
	<div class="min-h-screen bg-gray-100">
		<main>
			<slot />
		</main>
	</div>
</template>
