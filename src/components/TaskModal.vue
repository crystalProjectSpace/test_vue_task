<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { storeToRefs} from 'pinia';
import { useScheduleStore } from '../stores';
import { DUMMY_TASK, NEW_TASK_ID, PRIORITY, SAVE_DELAY } from '../constants';
import type { ScheduleTask, SelectOptions, TaskFields } from '../interfaces';
import { generateId } from '../utils';
import TSInput from './controls/TSInput.vue';
import TSSelect from './controls/TSSelect.vue';
import TSToggle from './controls/TSToggle.vue';

const emits = defineEmits(['close', 'update']);
interface TaskModalProps {
  taskId: string,
};
const props = defineProps<TaskModalProps>();
const scheduleStore = useScheduleStore();

const priorityOptions: SelectOptions[] = [
  { label: 'Высокий', value: PRIORITY.HIGH},
  { label: 'Средний', value: PRIORITY.MEDIUM },
  { label: 'Низкий', value: PRIORITY.LOW },
]

const activeTask = ref<ScheduleTask | null>();
const loading = ref(false);
const { items } = storeToRefs(scheduleStore);

const activeTaskId = computed(() => props.taskId);

const currentTask = computed(() => {
  if(!props.taskId) {
    return null;
  }
  const isNew = props.taskId === NEW_TASK_ID
  return isNew ? DUMMY_TASK : items.value.find(item => item.id === props.taskId);
})

function updateTask(evt: { fieldId: TaskFields, val: unknown }) {
  const { fieldId, val } = evt;
  activeTask.value = { ...activeTask.value, [fieldId]: val }  as ScheduleTask;
}

function resetChanges() {
  activeTask.value = { ...currentTask.value } as ScheduleTask; 
}

function submitChanges() {
  if(!activeTask.value) {
    return;
  }
  const isNew = props.taskId === NEW_TASK_ID;
  const id = isNew ? generateId() : activeTask.value.id;
  const result = { ...activeTask.value, updated_at: (new Date()).getTime(), id };

  if(!result.created_at) {
    result.created_at = performance.now();
  }
  loading.value = true
  setTimeout(() => {
    emits('update', result);
    loading.value = false;
  }, SAVE_DELAY);
}

function close() {
  if(!loading.value) {
    emits('close');
  }
}

watch(activeTaskId, async (val) => {
  await nextTick();
  if(val && currentTask.value) {
    resetChanges();
  }
})

onMounted(() => {
  if(props.taskId) {
    resetChanges();
  }
})

</script>
<template>
    <div class="modal">
        <div
          class="modal-shadow"
          @touchstart.prevent.default="close"
          @touchend.prevent.default="close"
          @click.prevent.default="close"
        />
        <div class="modal-content" v-if="activeTask" >
          <div class="modal-header">
            <span>
              {{ taskId === NEW_TASK_ID ? 'Создание новой задачи' : 'Редактирование задачи' }}
            </span>
            <button type="button" class="_btn-close" @click="close" >
              &#9587;
            </button>
          </div>
          <div v-if="!loading" class="modal-inputs">
            <TSInput :value="activeTask" fieldId="name" label="Название задачи" @update="updateTask" />
            <TSInput :value="activeTask" fieldId="description" label="Описание задачи" :multiline="true" @update="updateTask"/>
            <TSSelect :value="activeTask" fieldId="priority" label="Приоритет задачи" :options="priorityOptions" @update="updateTask"/>
            <TSToggle :value="activeTask" fieldId="status" label="Задача активна" @update="updateTask" />
          </div>
          <div v-else>
            <span>Сохранение правок...</span>
            <span class="_modal-loader-wrap">
              <span class="_modal-loader" />
            </span>            
          </div>
          <div class="modal-buttons">
            <button class="_btn-modal _secondary" type="reset" @click.prevent="resetChanges" :disabled="loading">
              Сбросить изменения
            </button>
            <button class="_btn-modal _primary" type="submit" @click.prevent="submitChanges" :disabled="loading">
              Сохранить
            </button>
          </div>
        </div>
    </div>
</template>