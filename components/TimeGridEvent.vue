<script lang="ts" setup>
import type { Event } from '@prisma/client';

const { calendarEvent } = defineProps<{ calendarEvent: Omit<Event, 'allDay' | 'userId'> }>();

const getTimeFromDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}`;
};
</script>

<template>
  <div class="w-100 h-100">
    <div class="sx__time-grid-event-title">{{calendarEvent.title }}</div>
    <div class="sx__time-grid-event-time">{{ getTimeFromDate(calendarEvent.start) }} - {{ getTimeFromDate(calendarEvent.end) }}</div>
  </div>
</template>

<style>
.sx__time-grid-event {
  width: calc(100% - 10px);
  padding: var(--sx-spacing-padding1);
  position: absolute;
  border-radius: var(--sx-rounding-extra-small);
  font-size: var(--sx-font-extra-small);
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;

  &.is-event-copy {
    opacity: 0.5;
    box-shadow: var(--sx-box-shadow-level3);
    z-index: 1;
    transition: transform 0.15s ease-in-out;
  }
}

.sx__time-grid-event-inner {
  position: relative;
  height: 100%;
}

.sx__time-grid-event-resize-handle {
  display: none;
}

/** Only display the resize handle on non-touch devices */
@media (hover: hover) {
  .sx__time-grid-event-resize-handle {
    display: block;
    position: absolute;
    width: 100%;
    bottom: 0;
    cursor: ns-resize;
    height: clamp(10px, 20px, 50%);
  }
}

.sx__time-grid-event-title {
  font-weight: 600;
}

.sx__time-grid-event-time,
.sx__time-grid-event-people {
  display: flex;
  align-items: center;
  white-space: nowrap;
}


[data-has-dnd='true'] {
  .sx__time-grid-event {
    touch-action: none;
  }
}

.sx__event-icon {
  min-width: 15px;
  min-height: 15px;
  max-width: 15px;
  max-height: 15px;
  margin-inline-end: var(--sx-spacing-padding2);
}
</style>
