<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center justify-center style-container">
      <q-card flat class="q-pa-lg text-center border-radius-8 bg-white style-card">
        <q-icon name="dashboard" size="48px" color="grey-7" class="q-mb-sm" />
        <div class="text-h6 text-weight-bold text-grey-9">Painel do Usuário</div>
        <div class="text-subtitle2 text-grey-6 q-mt-xs">
          Dashboard de Locatário.
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>

<style scoped>
.style-container {
  min-height: 70vh;
}

.style-card {
  max-width: 450px;
  width: 100%;
}

.border-radius-8 {
  border-radius: 8px;
}
</style>