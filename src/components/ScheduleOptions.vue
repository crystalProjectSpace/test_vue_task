<script setup lang="ts">
import { ref } from 'vue';
const showMenu = ref(false);
const emits = defineEmits(['select-all', 'deselect-all', 'delete']);

function toggleMenu() {
    showMenu.value = !showMenu.value;
}

</script>
<template>
    <div class="scheduler-options-wrapper _select" ref="options">
        <button
            class="_btn-modal _secondary scheduler-options-list-header"
            type="button" @click="toggleMenu">[&nbsp;Опции&nbsp;]
        </button>
        <ul v-show="showMenu" class="scheduler-options-list _select-list">
            <li role="button" class="scheduler-options-list-item _select-item" @click="emits('select-all')">
                Выделить все
            </li>
            <li role="button" class="scheduler-options-list-item _select-item" @click="emits('deselect-all')">
                Очистить выделение
            </li>
            <li role="button" class="scheduler-options-list-item _select-item" @click="emits('delete')">
                Удалить выделенное
            </li>
        </ul>
    </div>
</template>