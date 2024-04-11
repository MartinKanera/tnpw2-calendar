<script lang="ts" setup>
import type { Event } from '@prisma/client';

const { event } = defineProps<{
  event: Omit<Event, 'userId' | 'allDay'>;
}>();

const open = defineModel<boolean>();
const snackbar = reactive({ show: false, text: '', color: '' });

const emit = defineEmits<{
  (e: 'delete',  eventId: string): void;
}>();

const loading = ref(false);

const removeEvent = async (eventId: string) => {
  loading.value = true;

  try {
    await $fetch(`/api/events/${eventId}`, { method: 'delete' });
    snackbar.text = 'Event deleted successfully';
    snackbar.color = 'success';
    emit('delete', eventId);
    open.value = false;
  } catch (error) {
    snackbar.text = 'An error occurred while deleting the event';
    snackbar.color = 'error';
  } finally {
    loading.value = false;
    snackbar.show = true;
  }
}

const closeDialog = () => {
  open.value = false;
}
</script>

<template>
  <DialogLayout :is-loading="loading" :is-dialog-open="open ?? false" @dialog-closed="closeDialog">
    <h2 class="mb-4">{{ event.title }}</h2>
    <v-text-field v-model="event.title" label="Title" />
    <v-btn @click="removeEvent(event.id)" color="error">Delete</v-btn>
  </DialogLayout>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color">
    {{ snackbar.text }}
  </v-snackbar>
</template>
