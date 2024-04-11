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
.sx__date-picker-popup {
  overflow: auto;
}
</style>
