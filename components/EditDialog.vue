<script lang="ts" setup>
import type { Event } from '@prisma/client';
import type { VueElement } from 'vue';

type EditEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
}

const { event: calendarEvent } = defineProps<{
  event: EditEvent;
}>();

const emit = defineEmits<{
  (e: 'delete', eventId: string): void;
  (e: 'update', event: Event): void;
}>();

const open = defineModel<boolean>();
const snackbar = reactive({ show: false, text: '', color: '' });
const event = reactive(calendarEvent);
const form = ref<VueElement & { validate: () => Promise<any> } | null>(null);

watch(() => event.allDay, (value) => {
  if (value || (event.startTime && event.endTime)) return;

  // Set default time values
  event.startTime = timeRoundedToNearestMinutes(15);
  event.endTime = timeRoundedToNearestMinutes(30, Math.ceil);
});

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

const getFullColsOrProvided = (cols: number | string) => {
  return !event.allDay ? cols : 12;
}

const updateEvent = async () => {
  loading.value = true;

  const { valid } = await form.value?.validate();

  if (!valid) {
    loading.value = false;
    return;
  }

  try {
    let { title, startDate, endDate, startTime, endTime, allDay } = event;

    if (!allDay) {
      endDate = startDate;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const eventResult = await $fetch<Event>(`/api/events/${event.id}`, { 
      method: 'patch',
      body: {
        title,
        start,
        end,
        allDay
      }
    });

    emit('update', eventResult);
    snackbar.text = 'Event updated successfully';
    snackbar.color = 'success';
    open.value = false;
  } catch (error) {
    snackbar.text = 'An error occurred while updating the event';
    snackbar.color = 'error';
  } finally {
    loading.value = false;
    snackbar.show = true;
  }
}

const titleRules = [
  (v: string) => !!v.trim() || 'Title is required',
  (v: string) => v.trim().length <= 64 || 'Title must be at most 64 characters'
];

const startDateRules = [
  (v: string) => !!v || 'Date is required'
];

const startTimeRules = [
  (v: string) => !!v || 'Time is required'
];

const endDateRules = [
  (v: string) => !!v || 'End Date is required',
  (v: string) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(v);
    return endDate >= startDate || 'End Date must be after Start Date';
  }
];

const endTimeRules = [
  (v: string) => !!v || 'End Time is required',
  (v: string) => {
    if (event.allDay) return true;

    const startTime = new Date(`${event.startDate}T${event.startTime}`);
    const endTime = new Date(`${event.startDate}T${v}`);

    return endTime > startTime || 'End Time must be after Start Time';
  }
]
</script>

<template>
  <DialogLayout :is-loading="loading" :is-dialog-open="open ?? false" @dialog-closed="closeDialog">
    <v-fab :disabled="loading" location="top" absolute icon="mdi-delete" color="error" @click="removeEvent(event.id)"></v-fab>
    <v-form ref="form" validate-on="submit lazy">
      <v-container scrollable>
        <v-row>
          <v-col>
            <h2 class="mb-4">Edit Event</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="7">
            <v-text-field v-model="event.title" label="Title" :rules="titleRules" :disabled="loading" :loading="loading" />
          </v-col>
          <v-col cols="12" sm="5">
            <v-checkbox v-model="event.allDay" label="All Day" :disabled="loading" />
          </v-col>
        </v-row>
        <v-divider class="mb-4"></v-divider>
        <v-row>
          <v-col cols="12" class="py-0 mt-4 mb-2">
            <span class="caption">Start</span>
          </v-col>
          <v-col cols="12" :md="getFullColsOrProvided(6)">
            <v-text-field v-model="event.startDate" label="Date" type="date" :rules="startDateRules" :disabled="loading" :loading="loading" />
          </v-col>
          <v-col v-if="!event.allDay" cols="12" md="6">
            <v-text-field v-model="event.startTime" label="Time" type="time" :rules="startTimeRules" :disabled="loading" :loading="loading"  />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0 mt-4 mb-2">
            <span class="caption">End</span>
          </v-col>
          <v-col v-if="event.allDay" cols="12">
            <v-text-field v-model="event.endDate" label="Date" type="date" :rules="endDateRules" :disabled="loading" :loading="loading"  />
          </v-col>
          <v-col v-if="!event.allDay" cols="12">
            <v-text-field v-model="event.endTime" label="Time" type="time" :rules="endTimeRules" :disabled="loading" :loading="loading"  />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-btn type="submit" block color="primary" @click.prevent="updateEvent" :loading="loading">Update</v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn block color="default" variant="outlined" @click="closeDialog" :disabled="loading">Cancel</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </DialogLayout>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color">
    {{ snackbar.text }}
  </v-snackbar>
</template>
