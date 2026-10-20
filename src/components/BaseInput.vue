<template>
  <div class="q-mb-sm">
    <label v-if="label" class="block q-mb-xs">
      {{ label }}
    </label>
    
    <q-input
      v-model="modelValue"
      borderless
      class="custom-input"
    />
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<string>();

defineProps<{
  label?: string;
}>();
</script>

<style scoped>
:deep(.custom-input .q-field__control) {
  background-color: #dcdcdc;
  border-radius: 12px;
  padding: 0 12px;
}
</style>
