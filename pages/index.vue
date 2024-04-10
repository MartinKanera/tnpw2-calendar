<script lang="ts" setup>
import type { Event as PrismaEvent } from '@prisma/client';

type Event = Omit<PrismaEvent, 'allDay' | 'userId'>;

import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthAgenda
} from '@schedule-x/calendar';

definePageMeta({
  middleware: "auth",
});

const modal = ref(false);
const event = ref({} as Event);

const calendarApp = createCalendar({
  isDark: true,
  selectedDate: '2023-12-19',
  views: [viewDay, viewWeek, viewMonthAgenda],
  defaultView: viewWeek.name,
  events: [
    {
      id: 1,
      title: 'Event 1',
      start: '2023-12-19',
      end: '2023-12-19',
    },
    {
      id: 2,
      title: 'Event 2',
      start: '2023-12-20 12:00',
      end: '2023-12-20 13:00',
    },
    {
      id: 3,
      title: 'Event 2',
      start: '2023-12-20 13:00',
      end: '2023-12-20 14:00',
    },
  ]
});

const openModal = (e: Event) => {
  modal.value = true;
  event.value = e;
}

const closeModal = () => {
  event.value = {} as Event;
}
</script>

<template>
  <Calendar :calendar-app="calendarApp" @event-clicked="openModal" />
  <v-dialog v-model="modal" @vue-unmounted="closeModal">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-sheet class="pa-4" elevation="4" rounded>
            <h2 class="mb-4">{{ event.title }}</h2>
            <v-text-field v-model="event.title" label="Title" />
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>
