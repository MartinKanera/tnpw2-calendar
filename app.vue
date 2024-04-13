<script lang="ts" setup>
  const { signOut, status, session } = useAuth();

  const isAuthenticated = computed(() => status.value === "authenticated");
</script>

<template>
  <v-app>
    <v-app-bar app v-if="isAuthenticated">
      <v-spacer />
      <span class="mr-4 text-subtitle-1">@{{ session?.user.username }}</span>
      <v-btn @click="signOut" icon="mdi-logout" variant="tonal" color="primary"/>
    </v-app-bar>
    <v-main :style="{ paddingTop: isAuthenticated ? '64px' : 0, paddingBottom: '40px' }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-main>
    <v-footer app class="d-flex flex-column w-100">Studentský zápočtový projekt</v-footer>
  </v-app>
</template>

<style>
html { overflow-y: auto }
html, body, #__nuxt {
  height: 100%;
}
</style>
