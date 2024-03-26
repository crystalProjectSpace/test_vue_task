<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'; 
import { SELECTION_KEY } from '../constants'
import type { ScheduleTask } from '../interfaces';
import { getReadableDate } from '../utils'

const props = defineProps<ScheduleTask>();
const emits = defineEmits(['toggle-check', 'toggle-fullscreen'])

const taskChecker = ref<HTMLButtonElement>()

const selectedTaskIds: Ref<string[]> = inject(SELECTION_KEY);

const taskCreated = computed(() => `Задача создана: ${getReadableDate(props.created_at)}`)
const taskUpdated = computed(() => `Задача изменена: ${getReadableDate(props.updated_at)}`)

const taskAuthorData = computed(() => `Задача создана пользователем[ID:${props.responsible_id}]`)
const isChecked = computed(() => selectedTaskIds.value.includes(props.id));

function setFullScreenMode(evt: MouseEvent) {
    const path = evt.composedPath()
    if(taskChecker.value && path.includes(taskChecker.value)) {
        return
    }
    emits('toggle-fullscreen', props.id)
}
</script>

<template>
    <li class="scheduler-list-item" :class="{ _finished: !props.status }" @click="setFullScreenMode">
        <div class="scheduler-list-item-contents">
            <div class="scheduler-list-item-meta">
                <span class="scheduler-list-item-title" v-text="props.name" />
                <span class="scheduler-list-item-date" v-text="taskCreated" />    
            </div>
            <div class="scheduler-list-item-description" v-text="props.description" />
            <div class="scheduler-list-item-meta">
                <span class="scheduler-list-item-title" v-text="taskAuthorData" />
                <span class="scheduler-list-item-date" v-text="taskUpdated" />    
            </div>
        </div>
        <button
            ref="taskChecker"
            type="button"
            class="_btn-check"
            @click.preventImmediate="emits('toggle-check', {taskId: props.id, isChecked })">
            <span v-if="isChecked">&#10004;</span>
        </button>
    </li>
</template>
