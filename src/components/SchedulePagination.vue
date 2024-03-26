<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useScheduleStore } from '../stores';
import { SORT } from '../constants';

const scheduleStore = useScheduleStore();
const { activePage, activeTasks, sortType } = storeToRefs(scheduleStore);
const activeCount = computed(() => activeTasks.value.listCount || 1);
const isFirstPage = computed(() => activePage.value === 0);
const isLastPage = computed(() => activePage.value >= activeCount.value - 1);
const totalCount = computed(() => activeTasks.value.count);

function sortDateAsc() {
    scheduleStore.changeSort(SORT.DATE_ASC);
}

function sortDateDesc() {
    scheduleStore.changeSort(SORT.DATE_DESC);
}

function sortActive() {
    scheduleStore.changeSort(SORT.STATUS_ACTIVE);
}

function sortFinished() {
    scheduleStore.changeSort(SORT.STATUS_FINISHED);
}

function backward() {
    scheduleStore.changePage(activePage.value - 1); 
}

function forward() {
    scheduleStore.changePage(activePage.value + 1);
}
</script>
<template>
    <div class="scheduler-pagination">
        <div class="pagination">
            <button type="button" class="_btn-pagination" :disabled="isFirstPage" @click="backward">&lt;</button>
            <span>{{ activePage + 1}}/{{ activeCount }}</span>
            <button type="button" class="_btn-pagination" :disabled="isLastPage" @click="forward">&gt;</button>
            <span>Всего задач:&nbsp;{{ totalCount }}</span>
        </div>
        <div class="scheduler-pagination-types">
            <span>Способ сортировки: </span>
            <button
                type="button"
                class="_btn-sort"
                :class="{_active: sortType === SORT.DATE_ASC}"
                @click="sortDateAsc"
            >
                &#9650;(по дате)
            </button>
            <button
                type="button"
                class="_btn-sort"
                @click="sortDateDesc"
                :class="{_active: sortType === SORT.DATE_DESC}"
            >
                &#9660;(по дате)
            </button>
            <button
                type="button"
                class="_btn-sort"
                @click="sortActive"
                :class="{_active: sortType === SORT.STATUS_ACTIVE}"
            >
                Активные
            </button>
            <button
                type="button"
                class="_btn-sort"
                @click="sortFinished"
                :class="{_active: sortType === SORT.STATUS_FINISHED}"
            >
                Завершенные
            </button>
        </div>
        <div class="pagination-count">
            
        </div>
    </div>
</template>