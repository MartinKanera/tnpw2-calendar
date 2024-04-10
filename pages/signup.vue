<script lang="ts" setup>
import type { VueElement } from 'vue';

definePageMeta({
  layout: "auth",
  middleware: "guest-only"
});

const { signIn } = useAuth();

const form = ref<VueElement & { validate: () => Promise<any> } | null>(null);
const username = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const loading = ref(false);

const snackbar = ref(false);
const snackbarContent = ref("");

const usernameRules = [
  (v: string) => !!v || "Username is required",
  (v: string) => v && v.length >= 3 || "Username must be at least 3 characters",
  (v: string) => v && v.length <= 16 || "Username must be at most 20 characters",
];

const emailRules = [
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v && v.length >= 8 || "Password must be at least 8 characters",
];

const passwordConfirmationRules = [
  (v: string) => !!v || "Password Confirmation is required",
  (v: string) => v === password.value || "Password Confirmation must match password",
];

const signUp = async (e: SubmitEvent) => {
  e.preventDefault();

  loading.value = true;
  const { valid } = await form.value?.validate();

  if (!valid) {
    loading.value = false;
    return;
  }
  
  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value,
        password: password.value,
      }
    });
  
    await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: true
    });
  } catch (error: any) {
    snackbarContent.value = error?.statusMessage ?? "An error occurred";
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <v-sheet class="pa-4" rounded elevation="4">
      <h2 class="mb-4">Sign up</h2>
      <v-form ref="form" validate-on="lazy" @on-submit="signUp">
        <v-text-field
          class="mb-2"
          v-model="username"
          label="Username"
          :rules="usernameRules"
          :disabled="loading"
          required
        ></v-text-field>
        <v-text-field
          class="mb-2"
          v-model="email"
          label="Email"
          type="email"
          :rules="emailRules"
          :disabled="loading"
          required
        ></v-text-field>
        <v-text-field
          class="mb-2"
          v-model="password"
          label="Password"
          type="password"
          :rules="passwordRules"
          :disabled="loading"
          required
        ></v-text-field>
        <v-text-field
          class="mb-2"
          v-model="passwordConfirmation"
          label="Password Confirmation"
          type="password"
          :rules="passwordConfirmationRules"
          :disabled="loading"
          required
        ></v-text-field>
        <div class="text-subtitle-1">
          Already have an account?
          <NuxtLink to="/login">Log in</NuxtLink>
        </div>
        <v-divider class="my-4"></v-divider>
        <v-btn
          @click="signUp"
          color="primary"
          :loading="loading"
          type="submit"
          block
        >
          Sign Up
        </v-btn>
      </v-form>
    </v-sheet>
    <v-snackbar
      v-model="snackbar"
      color="error"
    >
      {{ snackbarContent }}
    </v-snackbar>
  </div>
</template>
