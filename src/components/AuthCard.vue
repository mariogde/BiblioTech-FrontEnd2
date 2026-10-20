<template>
  <q-card class="auth-card">
    <q-card-section>
      <div class="text-h5 text-weight-bolder">BiblioTech</div>
      <div v-if="subtitulo" class="subtitulo">
        {{ subtitulo }}
      </div>
    </q-card-section>

    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  subtitulo?: string;
}>();
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.subtitulo {
  color: #616161;
  font-size: 12px;
  margin-top: 4px;
}
</style>