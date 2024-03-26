<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import ScheduleItem from './ScheduleItem.vue'
import { useScheduleStore } from '../stores'
import type { TaskCheckEvt } from '../interfaces';
import { NEW_TASK_ID } from '../constants';
const emits = defineEmits(['toggle-check', 'toggle-fullscreen'])
const scheduleStore = useScheduleStore()
const { activeTasks } = storeToRefs(scheduleStore);
const activeTaskList = computed(() => activeTasks.value.list)

function toggleCheckTask(evt: TaskCheckEvt) {
    emits('toggle-check', evt)
}

function toggleFullscreen(evt: string) {
    emits('toggle-fullscreen', evt);
}

</script>
<template>
    <div class="scheduler-list-wrapper">
        <h3 class="scheduler-list-header">Список актуальных задач</h3>
        <ul class="scheduler-list">
            <li class="scheduler-list-item _new" @click="toggleFullscreen(NEW_TASK_ID)">
                <span class="_line" />
                <span>Создать новую задачу</span>
                <span class="_line" />
            </li>
            <ScheduleItem
                v-for="task in activeTaskList"
                :key="task.id"
                v-bind="task"
                @toggle-check="toggleCheckTask"
                @toggle-fullscreen="toggleFullscreen"/>
        </ul>
    </div>
</template>