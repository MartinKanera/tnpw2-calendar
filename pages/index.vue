<script lang="ts" setup>
const { session } = useAuth();

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div>
    <h1>{{ session?.user?.email }}</h1>
    <p>Welcome to the home page</p>
  </div>
</template>
