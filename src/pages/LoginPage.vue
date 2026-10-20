<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="login-bg flex flex-center q-pa-md">
        <AuthCard>
          <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
            <BaseInput
              label="E-mail"
              v-model="form.email"
              type="email"
            />

            <BaseInput
              label="Senha"
              v-model="form.senha"
              type="password"
            />

            <div class="q-pt-sm">
              <q-btn
                label="Entrar"
                type="submit"
                unelevated
                rounded
                :loading="carregando"
                class="full-width btn-submit"
              />
            </div>
          </q-form>

          <div class="row justify-around q-mt-lg text-caption">
            <router-link to="/cadastro" class="custom-link">
              Cadastre-se agora
            </router-link>
            <router-link to="/esqueci-senha" class="custom-link">
              Esqueceu a senha
            </router-link>
          </div>
        </AuthCard>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">

import type { AxiosError } from 'axios';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/authStore';
import AuthCard from '../components/AuthCard.vue';
import BaseInput from '../components/BaseInput.vue';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const carregando = ref(false);
const form = reactive({
  email: '',
  senha: ''
});

async function handleLogin() {
  carregando.value = true;
  try {
    await authStore.login({
      email: form.email,
      password: form.senha
    });

    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!'
    });

    await router.push('/app');
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Erro ao realizar login. Verifique e-mail e senha.'
    });
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.login-bg {
  background-color: #f4f3ef;
}

.btn-submit {
  background-color: #2e4a3e !important;
  color: #ffffff !important;
  text-transform: none;
  font-weight: 600;
  height: 42px;
  border-radius: 20px;
}

.custom-link {
  color: #000000;
  text-decoration: underline;
  font-weight: 500;
}

.custom-link:hover {
  opacity: 0.7;
}
</style>