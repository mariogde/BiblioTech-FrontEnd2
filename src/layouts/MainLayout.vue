<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Sidebar / Drawer Lateral Estilizado -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      style="background-color: #373a3d !important; color: #ffffff;"
      class="column justify-between q-pa-md"
    >
      <div>
        <!-- Logo BiblioTech -->
        <div class="row items-center q-mb-xl q-px-sm">
          <q-avatar size="36px" color="white" text-color="dark" class="q-mr-sm">
            <q-icon name="menu_book" size="20px" />
          </q-avatar>
          <span class="text-h6 text-weight-bold text-white">BiblioTech</span>
        </div>

        <!-- Menu de Navegação em Português -->
        <q-list class="q-gutter-y-xs">
          <q-item
            clickable
            v-ripple
            to="/admin/dashboard"
            active-class="active-menu-item"
            class="sidebar-item"
          >
            <q-item-section class="text-weight-medium">Dashboard</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/renters"
            active-class="active-menu-item"
            class="sidebar-item"
          >
            <q-item-section class="text-weight-medium">Locatários</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/books"
            active-class="active-menu-item"
            class="sidebar-item"
          >
            <q-item-section class="text-weight-medium">Livros</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/publishers"
            active-class="active-menu-item"
            class="sidebar-item"
          >
            <q-item-section class="text-weight-medium">Editoras</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/rentals"
            active-class="active-menu-item"
            class="sidebar-item"
          >
            <q-item-section class="text-weight-medium">Aluguéis</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Botão Sair -->
      <div class="q-pb-sm">
        <q-btn
          label="Sair"
          no-caps
          unelevated
          class="full-width btn-exit"
          @click="handleLogout"
        />
      </div>
    </q-drawer>

    <q-page-container class="bg-light-gray">
      <div class="row justify-end items-center q-pa-md bg-white border-bottom-light">
        <div class="row items-center q-gutter-x-md">
          <q-btn-dropdown
            flat
            dense
            no-caps
            :label="currentLanguage"
            class="bg-grey-3 rounded-borders q-px-sm"
          >
            <q-list>
              <q-item clickable v-close-popup @click="selectLanguage('Português')">
                <q-item-section>Português</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="selectLanguage('Inglês')">
                <q-item-section>Inglês</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="selectLanguage('Espanhol')">
                <q-item-section>Espanhol</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <div class="row items-center q-gutter-x-xs">
            <q-avatar size="32px" color="grey-7" text-color="white" icon="person" />
            <span class="text-weight-bold text-subtitle2 q-ml-xs">Usuário</span>
          </div>
        </div>
      </div>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/authStore';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const leftDrawerOpen = ref(true);
const currentLanguage = ref('Português');

function selectLanguage(lang: string) {
  currentLanguage.value = lang;
}

function handleLogout() {
  $q.dialog({
    title: 'Sair',
    message: 'Deseja realmente encerrar a sessão?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Sair', color: 'negative' },
    persistent: true
  }).onOk(() => {
    authStore.logout();
    void router.push('/login');
  });
}
</script>

<style scoped>
.sidebar-dark {
  background-color: #2b2d30 !important; 
  color: #ffffff;
}

.sidebar-item {
  color: #e0e0e0;
  border-radius: 6px;
  text-align: center;
  justify-content: center;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.active-menu-item {
  background-color: #bebebe !important;
  color: #111827 !important;
  font-weight: 700 !important;
  border-radius: 6px;
}

.btn-exit {
  background-color: #e5e7eb !important;
  color: #1f2937 !important;
  font-weight: 600;
  border-radius: 20px;
  height: 40px;
}

.bg-light-gray {
  background-color: #f3f4f6;
  min-height: 100vh;
}

.border-bottom-light {
  border-bottom: 1px solid #e5e7eb;
}
</style>