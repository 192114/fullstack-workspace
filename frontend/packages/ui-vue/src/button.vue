<script setup lang="ts">
withDefaults(
	defineProps<{
		variant?: "primary" | "secondary" | "outline";
		disabled?: boolean;
	}>(),
	{ variant: "primary" },
);

defineOptions({
	inheritAttrs: false,
});
</script>

<template>
  <button
    type="button"
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50',
      variant === 'primary' &&
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
      variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      variant === 'outline' && 'border border-gray-300 bg-transparent hover:bg-gray-50',
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
