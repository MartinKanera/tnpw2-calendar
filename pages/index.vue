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

const isEditDialogOpen = ref(false);
const event = ref({} as Omit<Event, 'userId' | 'allDay'>);

const calendarApp = createCalendar({
  isDark: true,
  views: [viewDay, viewWeek, viewMonthAgenda],
  defaultView: viewWeek.name,
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

onMounted(() => {
  const weekStart = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString();
  const weekEnd = new Date(new Date().setDate(new Date().getDate() + (6 - new Date().getDay()))).toISOString();
  fetchEvents(weekStart, weekEnd);
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

const openModal = (e: Omit<Event, 'userId' | 'allDay'>) => {
  isEditDialogOpen.value = true;
  event.value = e;
}

const eventDeleted = (eventId: string) => {
  calendarApp.events.remove(eventId);
}
</script>

<template>
  <Calendar :calendar-app="calendarApp" />
  <EditDialog v-model="isEditDialogOpen" :event="event" @delete="eventDeleted" />
</template>
