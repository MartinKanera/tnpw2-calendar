<script lang="ts" setup>
import type { VueElement } from 'vue';

definePageMeta({
  layout: "auth",
  middleware: "guest-only"
});

const { signIn } = useAuth()

const form = ref<VueElement & { validate: () => Promise<any> } | null>(null);
const email = ref("");
const password = ref("");
const loading = ref(false);

const snackbar = ref(false);
const snackbarContent = ref("");

const emailRules = [
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v && v.length >= 8 || "Password must be at least 8 characters",
];

const logIn = async (e: SubmitEvent) => {
  e.preventDefault();

  loading.value = true;
  const { valid } = await form.value?.validate();

  if (!valid) {
    loading.value = false;
    return;
  }
  
  try {
    await signIn('credentials', {
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    snackbarContent.value = "Incorrect email or password";
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <v-sheet class="pa-4" rounded elevation="4">
      <h2 class="mb-4">Log in</h2>
      <v-form ref="form" validate-on="lazy" @on-submit="logIn">
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
        <div class="text-subtitle-1">
          Don't have an account?
          <NuxtLink to="/signup">Sign up</NuxtLink>
        </div>
        <v-divider class="my-4"></v-divider>
        <v-btn
          class="mt-4"
          block
          color="primary"
          :loading="loading"
          type="submit"
          @click="logIn"
        >
          Log in
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
