<script setup lang="ts">
defineProps<{
	open: boolean;
	title?: string;
}>();

const emit = defineEmits<{
	close: [];
}>();

// biome-ignore lint/correctness/noUnusedVariables: used in template @click
function handleBackdropClick() {
	emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="handleBackdropClick"
        @keydown.escape="emit('close')"
      />
      <div
        class="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
      >
        <h2 v-if="title" class="text-lg font-semibold mb-4">{{ title }}</h2>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
