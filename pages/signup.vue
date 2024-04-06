<script lang="ts" setup>
import type { VueElement } from 'vue';

definePageMeta({
  layout: "auth",
});

const form = ref<VueElement & { validate: () => Promise<any> } | null>(null);
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");

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

const signup = async () => {
  const { valid } = await form.value?.validate();

  if (!valid) return;
  
  // TODO Handle
};
</script>

<template>
  <v-sheet class="p-4" rounded elevation="4">
    <h2 class="mb-4">Sign up</h2>
    <v-form ref="form" validate-on="lazy">
      <v-text-field
        class="mb-2"
        v-model="email"
        label="Email"
        type="email"
        :rules="emailRules"
        required
      ></v-text-field>
      <v-text-field
        class="mb-2"
        v-model="password"
        label="Password"
        type="password"
        :rules="passwordRules"
        required
      ></v-text-field>
      <v-text-field
        class="mb-2"
        v-model="passwordConfirmation"
        label="Password Confirmation"
        type="password"
        :rules="passwordConfirmationRules"
        required
      ></v-text-field>
      <div class="text-subtitle-1">
        Already have an account?
        <NuxtLink to="/login">Log in</NuxtLink>
      </div>
      <v-divider class="my-4"></v-divider>
      <v-btn
        @click="signup"
        color="primary"
        block
      >
        Sign Up
      </v-btn>
    </v-form>
  </v-sheet>
</template>
