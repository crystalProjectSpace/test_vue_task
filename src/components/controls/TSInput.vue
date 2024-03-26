<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { ScheduleTask, TaskFields } from '../../interfaces';
import { hideOnclickOutside } from '../../utils';
interface TSInputProps {
    value: ScheduleTask,
    fieldId: TaskFields,
    label: string;
    multiline?: boolean,
};
const props = defineProps<TSInputProps>();
const editMode = ref(false)
const inputWrap = ref<HTMLElement>()
const inputValue = ref(props.value[props.fieldId]);
const emits = defineEmits(['update']);

function setEditMode() {
    editMode.value = true;
}

function clearEditMode() {
    editMode.value = false;
}

watch(inputValue, (val) => {
    emits('update', { fieldId: props.fieldId, val });
})

function hideInput(evt: MouseEvent) {
    inputWrap.value && hideOnclickOutside(evt, inputWrap, clearEditMode);
}

onMounted(() => {
    document.addEventListener('click',hideInput);
})

onUnmounted(() => {
    document.removeEventListener('click',hideInput);
})
</script>

<template>
    <div class="input-wrap" ref="inputWrap">
        <span class="input-label" v-text="props.label" />
        <div v-if="!editMode" class="input-content" v-text="inputValue" @click="setEditMode"/>
        <div v-else class="input-control">
            <input v-if="!multiline" type="text" class="input-control-text" v-model="inputValue" />
            <textarea v-else class="input-control-text" v-model="inputValue" rows="6"/>
            <button
                type="button"
                class="_btn-check"
                style="{ border: none }"
                @click.preventImmediate="clearEditMode"
            >
                &#10004;
            </button>
        </div>
    </div>
</template>
