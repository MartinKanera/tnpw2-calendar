<script lang="ts" setup>
import type { Event } from '@prisma/client'; 
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
</script>

<template>
  <DialogLayout :is-loading="loading" :is-dialog-open="open ?? false" @dialog-closed="closeDialog">
    <v-container scrollable>
      <v-row>
        <v-col>
          <h2 class="mb-4">Create Event</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="7">
          <v-text-field v-model="event.title" label="Title" />
        </v-col>
        <v-col cols="12" sm="5" >
          <v-checkbox v-model="event.allDay" label="All Day" />
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>
      <v-row>
        <v-col cols="12" class="py-0 mt-4 mb-2">
          <span class="caption">Start</span>
        </v-col>
        <v-col cols="12" :md="getFullColsOrProvided(6)">
          <v-text-field v-model="event.startDate" label="Date" type="date" />
        </v-col>
        <v-col v-if="!event.allDay" cols="12" md="6">
          <v-text-field v-model="event.startTime" label="Time" type="time" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="py-0 mt-4 mb-2">
          <span class="caption">End</span>
        </v-col>
        <v-col v-if="event.allDay" cols="12">
          <v-text-field v-model="event.endDate" label="Date" type="date" />
        </v-col>
        <v-col v-if="!event.allDay" cols="12">
          <v-text-field v-model="event.endTime" label="Time" type="time" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-btn block color="primary">Create</v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn block color="default" variant="outlined">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </DialogLayout>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color">
    {{ snackbar.text }}
  </v-snackbar>
</template>
