<template>
  <v-app>
    <v-main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-main>
    <v-footer app class="d-flex flex-column">Studentský projekt</v-footer>
  </v-app>
</template>

<style>
html { overflow-y: auto }
html, body, #__nuxt {
  height: 100%;
}
</style>
