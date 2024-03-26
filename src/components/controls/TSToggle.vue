<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ScheduleTask, TaskFields } from '../../interfaces';

interface TSSelectProps {
    value: ScheduleTask,
    fieldId: TaskFields,
    label: string;
};
const props = defineProps<TSSelectProps>();

const inputValue = ref(props.value[props.fieldId]);
const emits = defineEmits(['update']);


function toggleValue() {
    inputValue.value = !inputValue.value;
}

watch(inputValue, (val) => {
    emits('update', { fieldId: props.fieldId, val });
})

</script>

<template>
    <div class="input-wrap" ref="selectWrap">
        <span class="input-label" v-text="props.label" />
        <div class="input-toggle" @click="toggleValue">
            <span class="input-toggle-thumb" :class="{ _active: inputValue }" />
        </div>
    </div>
</template>
