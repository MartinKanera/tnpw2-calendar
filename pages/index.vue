<script lang="ts" setup>
import type { Event } from '@prisma/client';
import { convertEventToCalendarEvent } from '~/utils/time';
import {
  createCalendar,
  viewDay,
  viewWeek
} from '@schedule-x/calendar';

definePageMeta({
  middleware: "auth",
});

type EditEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
}

const displayCreateButton = ref(false);
const isEditDialogOpen = ref(false);
const isCreateDialogOpen = ref(false);
const event = reactive({} as EditEvent);

const calendarApp = createCalendar({
  isDark: true,
  views: [viewDay, viewWeek],
  defaultView: viewWeek.name,
  callbacks: {
    onEventClick: (e) => {
      openEditDialog(e as any)
    },
    onRangeUpdate({ start, end }) {
      // Fetch events for the new range
      fetchEvents(new Date(start).toISOString(), new Date(end).toISOString());
    }
  }
});

onMounted(() => {
  displayCreateButton.value = true;
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

const openEditDialog = (e: { id: string, title: string, start: string, end: string }) => {
  const { id, title, start, end } = e;
  isEditDialogOpen.value = true;

  const [startDate, startTime] = start.split(' ');
  const [endDate, endTime] = end.split(' ');

  event.id = id;
  event.title = title;
  event.startDate = startDate;
  event.startTime = startTime;
  event.endDate = endDate;
  event.endTime = endTime;
  event.allDay = !startTime && !endTime;
}

const eventCreated = (e: Event) => {
  calendarApp.events.add(convertEventToCalendarEvent(e));
}

const eventUpdated = (e: Event) => {
  calendarApp.events.update(convertEventToCalendarEvent(e));
}

const eventDeleted = (eventId: string) => {
  calendarApp.events.remove(eventId);
}
</script>

<template>
  <Calendar :calendar-app="calendarApp" />
  <v-fab color="primary" app icon="mdi-plus" size="large" @click="openCreateDialog" :active="displayCreateButton"></v-fab>
  <EditDialog v-model="isEditDialogOpen" :event="event" @update="eventUpdated" @delete="eventDeleted" />
  <CreateDialog v-model="isCreateDialogOpen" @create="eventCreated" />
</template>
