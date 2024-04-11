<script lang="ts" setup>
import type { Event } from '@prisma/client';
import { convertEventToCalendarEvent } from '~/utils/iso-string-convertor';
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
const event = ref({} as Omit<Event, 'userId' | 'allDay'>);

const { data } = useFetch('/api/events', {
  query: {
    // Get first day of this month
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    // Get last day of this month
    end : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
  }
});

const calendarApp = createCalendar({
  isDark: true,
  views: [viewDay, viewWeek, viewMonthAgenda],
  defaultView: viewWeek.name,
  // @ts-expect-error
  // Convert PrismaEvent to CalendarEvent
  events: data.value?.map(convertEventToCalendarEvent),
  callbacks: {
    onEventClick: (e) => {
      openModal(e as unknown as Event)
    },
    onRangeUpdate({ start, end }) {
      // Fetch events for the new range
      fetchEvents(new Date(start).toISOString(), new Date(end).toISOString());
    }
  }
});

const fetchEvents = async (start: string, end: string) => {
  const events = await $fetch<Event[]>('/api/events', {
    query: { start, end }
  });

  for (const event of events) {
    if (calendarApp.events.get(event.id)) continue;
    calendarApp.events.add(convertEventToCalendarEvent(event));
  }
}

const openModal = (e: Event) => {
  modal.value = true;
  event.value = e;
}

const closeModal = () => {
  event.value = {} as Event;
}
</script>

<template>
  <Calendar :calendar-app="calendarApp" />
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
