<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ScheduleList from './components/ScheduleList.vue';
import TaskModal from './components/TaskModal.vue';
import type { ScheduleTask, TaskCheckEvt } from './interfaces';
import { SELECTION_KEY } from './constants';
import { useScheduleStore } from './stores';
import ScheduleOptions from './components/ScheduleOptions.vue';
import SchedulePagination from './components/SchedulePagination.vue';

const scheduleStore = useScheduleStore();

const checkedTaskIds = ref([] as string[]);
const editedTaskId = ref('');
const { activeTasks, sortType } = storeToRefs(scheduleStore);
const activeTaskList = computed(() => activeTasks.value.list)

function clearTasksCheck() {
  checkedTaskIds.value = [];
}

function updTasksCheck(evt: TaskCheckEvt) {
  const { taskId, isChecked } = evt;
  checkedTaskIds.value = isChecked
    ? checkedTaskIds.value.filter(id => id !== taskId)
    : [...checkedTaskIds.value, taskId];
}

function updateTask(evt: ScheduleTask) {
  scheduleStore.updList(evt);
  scheduleStore.saveList();
  clearEditedTask();
}

function setEditedTask(evt: string) {
  editedTaskId.value = evt;
}

function clearEditedTask() {
  editedTaskId.value = '';
}

function selectAllTasks() {
  checkedTaskIds.value = activeTaskList.value.map(({ id }) => id);
}

function deleteSelectedTasks() {
  if(!checkedTaskIds.value.length) {
    return
  }
  scheduleStore.removeItems(checkedTaskIds.value);
  scheduleStore.saveList();
  clearEditedTask();
}

provide(SELECTION_KEY, checkedTaskIds);

scheduleStore.getListData();
</script>

<template>
  <div>
    <main class="scheduler-main">
      <ScheduleOptions
        @select-all="selectAllTasks"
        @deselect-all="clearTasksCheck"
        @delete="deleteSelectedTasks"
        
      />
      <ScheduleList
        :key="sortType"
        @toggle-check="updTasksCheck"
        @toggle-fullscreen="setEditedTask"
      />
      <TaskModal
        :key="editedTaskId"
        v-show="editedTaskId"
        :taskId="editedTaskId"
        @close="clearEditedTask"
        @update="updateTask"
      />
    </main>
  </div>
  <SchedulePagination />
</template>
<style scoped></style>
