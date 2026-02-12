<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: used in template
import HomePage from "./features/home/home.page.vue";
// biome-ignore lint/correctness/noUnusedImports: used in template
import MainLayout from "./layouts/main-layout.vue";
</script>

<template>
	<MainLayout>
		<HomePage />
	</MainLayout>
</template>
