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
const isCreateDialogOpen = ref(false);
const event = ref({} as Omit<Event, 'userId' | 'allDay'>);

const calendarApp = createCalendar({
  isDark: true,
  views: [viewDay, viewWeek, viewMonthAgenda],
  defaultView: viewWeek.name,
  callbacks: {
    onEventClick: (e) => {
      openEditDialog(e as unknown as Event)
    },
    onRangeUpdate({ start, end }) {
      // Fetch events for the new range
      fetchEvents(new Date(start).toISOString(), new Date(end).toISOString());
    }
  }
});

onMounted(() => {
  // Monday this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  // Sunday this week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  fetchEvents(weekStart.toISOString(), weekEnd.toISOString());
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

const openCreateDialog = () => {
  isCreateDialogOpen.value = true;
}

const openEditDialog = (e: Omit<Event, 'userId' | 'allDay'>) => {
  isEditDialogOpen.value = true;
  event.value = e;
}

const eventCreated = (e: Event) => {
  calendarApp.events.add(convertEventToCalendarEvent(e));
}

const eventDeleted = (eventId: string) => {
  calendarApp.events.remove(eventId);
}
</script>

<template>
  <Calendar :calendar-app="calendarApp" />
  <v-fab color="primary" app icon="mdi-plus" size="large" @click="openCreateDialog"></v-fab>
  <EditDialog v-model="isEditDialogOpen" :event="event" @delete="eventDeleted" />
  <CreateDialog v-model="isCreateDialogOpen" @create="eventCreated" />
</template>
