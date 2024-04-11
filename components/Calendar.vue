<script lang="ts" setup>
import type { Event } from '@prisma/client';
import { ScheduleXCalendar } from '@schedule-x/vue';
import type { CalendarApp } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';

const { calendarApp } = defineProps<{ calendarApp: CalendarApp }>();

</script>

<template>
  <ClientOnly>
    <ScheduleXCalendar :calendar-app="calendarApp"></ScheduleXCalendar>
  </ClientOnly>
</template>

<style>
.sx__time-grid-event {
  background-color: var(--sx-color-primary-container);
  color: var(--sx-color-on-primary-container);
  border-left: 4px solid var(--sx-color-primary);
}

.sx__time-grid-event-inner {
  padding: var(--sx-spacing-padding1);
}
</style>
