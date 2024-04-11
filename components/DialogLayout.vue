<script lang="ts" setup>
const { isDialogOpen, isLoading } = defineProps<{
  isDialogOpen: boolean;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'dialog-closed'): void;
}>();

const dialogClosed = () => {
  emit('dialog-closed');
} 
</script>

<template>
  <v-dialog :model-value="isDialogOpen" @afterLeave="dialogClosed" :persistent="isLoading">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-sheet class="pa-4" elevation="4" rounded>
            <slot></slot>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>
