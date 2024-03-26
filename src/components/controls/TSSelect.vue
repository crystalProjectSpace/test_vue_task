<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ScheduleTask, SelectOptions, TaskFields } from '../../interfaces';
import { hideOnclickOutside } from '../../utils';

interface TSSelectProps {
    value: ScheduleTask,
    fieldId: TaskFields,
    label: string;
    options: SelectOptions[],
};
const props = defineProps<TSSelectProps>();
const editMode = ref(false)
const inputList = ref<HTMLElement>()
const selectWrap = ref<HTMLElement>()
const inputValue = ref(props.value[props.fieldId]);
const emits = defineEmits(['update']);

const inputText = computed(() => props.options.find(o => o.value === inputValue.value)?.label)

function setEditMode() {
    editMode.value = true;
}

function clearEditMode() {
    editMode.value = false;
}

function selectOption(val: string | number) {
    inputValue.value = val;
}

watch(inputValue, (val) => {
    emits('update', { fieldId: props.fieldId, val });
})

function hideList(evt: MouseEvent) {
    const path = evt.composedPath()
    const selectElt = selectWrap.value;
    if(!selectElt) {
        return;
    }
    if(selectElt && path.includes(selectElt)) {
        return;
    }
    inputList.value && editMode.value && hideOnclickOutside(evt, inputList, clearEditMode );
}

onMounted(() => {
    document.addEventListener('click', hideList);
})

onUnmounted(() => {
    document.removeEventListener('click',hideList);
})
</script>

<template>
    <div class="input-wrap" ref="selectWrap">
        <span class="input-label" v-text="props.label" />
        <div class="input-content__select _select" @click="setEditMode">
            <span v-text="inputText" />
            <ul v-if="editMode" ref="inputList" class="input-control__select-list _select-list">
                <li
                    v-for="option in props.options"
                    :key="option.value" v-text="option.label"
                    class="input-control-option _select-item"
                    :class="{_selected: option.value === inputValue }"
                    @click="selectOption(option.value)"
                />
            </ul>
        </div>
    </div>
</template>
