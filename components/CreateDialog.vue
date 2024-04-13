<script lang="ts" setup>
import type { Event } from '@prisma/client';
import type { VueElement } from 'vue';
import { fromISOString, timeFromISOString } from '~/utils/iso-string-convertor';

type CreateEvent = {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
}

const open = defineModel<boolean>();
const snackbar = reactive({ show: false, text: '', color: '' });
const form = ref<VueElement & { validate: () => Promise<any> } | null>(null);

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
  (v: string) => v >= event.startDate || 'End Date must be after Start Date'
];

const endTimeRules = [
  (v: string) => !!v || 'End Time is required',
  (v: string) => v >= event.startTime || 'End Time must be after Start Time'
]

watch(open, (value) => {
  // TODO Test if works
  if (value) resetEvent();
})

onMounted(() => {
  resetEvent();
})

const emit = defineEmits<{
  (e: 'create',  event: Event): void;
}>();

const timeRoundedToNearest = (t = 15, fn = Math.floor) => {
  const coeff = 1000 * 60 * t;
  return new Date(fn(new Date().getTime() / coeff) * coeff);
}

const event = reactive({} as CreateEvent);

const loading = ref(false);

const resetEvent = () => {
  event.title = '';
  event.startDate = fromISOString(new Date().toISOString(), true);
  event.endDate = fromISOString(new Date().toISOString(), true);
  event.startTime = timeFromISOString(timeRoundedToNearest().toISOString());
  event.endTime = timeFromISOString(timeRoundedToNearest(30, Math.ceil).toISOString());
  event.allDay = false;
}

const closeDialog = () => {
  open.value = false;
}

const getFullColsOrProvided = (cols: number | string) => {
  return !event.allDay ? cols : 12;
}

const createEvent = async () => {
  if (!(await form.value?.validate())) return;

  loading.value = true;

  try {
    let { title, startDate, endDate, startTime, endTime, allDay } = event;

    // If allDay is true, set the start time to 00:00 and end time to 23:59
    if (allDay) {
      startTime = '00:00';
      endTime = '23:59';
    } else {
      // If event is not all day, set the end date to start date
      endDate = startDate;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const createdEvent = await $fetch<Event>('/api/events', {
      method: 'post',
      body: {
        title,
        start,
        end,
        allDay
      }
    });

    emit('create', createdEvent);
    snackbar.text = 'Event created successfully';
    snackbar.color = 'success';
    closeDialog();
  } catch (error) {
    snackbar.text = 'An error occurred while creating the event';
    snackbar.color = 'error';
  } finally {
    loading.value = false;
    snackbar.show = true;
  }
}
</script>

<template>
  <DialogLayout :is-loading="loading" :is-dialog-open="open ?? false" @dialog-closed="closeDialog">
    <v-form ref="form" validate-on="submit lazy">
      <v-container scrollable>
        <v-row>
          <v-col>
            <h2 class="mb-4">Create Event</h2>
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
            <v-btn type="submit" block color="primary" @click.prevent="createEvent" :loading="loading">Create</v-btn>
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
