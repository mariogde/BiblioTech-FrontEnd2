<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="login-bg flex flex-center q-pa-md">
        <AuthCard>
          <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
            <BaseInput
              label="Email"
              v-model="form.email"
              type="email"
            />

            <BaseInput
              label="Password"
              v-model="form.password"
              type="password"
            />

            <div class="q-pt-sm">
              <q-btn
                label="Sign In"
                type="submit"
                unelevated
                rounded
                :loading="isLoading"
                class="full-width btn-submit"
              />
            </div>
          </q-form>

          <div class="row justify-around q-mt-lg text-caption">
            <router-link to="/register" class="custom-link">
              Register now
            </router-link>
            <router-link to="/forgot-password" class="custom-link">
              Forgot password
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

interface ApiProblemDetail {
  message?: string;
  detail?: string;
}

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const form = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  isLoading.value = true
  try {
    const user = await authStore.login(form.email, form.password)

    if (user) {
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!'
      })

      if (authStore.isAdmin) {
        await router.push('/admin/books')
      } else {
        await router.push('/user/dashboard')
      }
    }
  } catch (err) {
    const error = err as AxiosError<ApiProblemDetail>
    const msg =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      'E-mail ou senha incorretos.'

    $q.notify({ type: 'negative', message: msg })
  } finally {
    isLoading.value = false
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