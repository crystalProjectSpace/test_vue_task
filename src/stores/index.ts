import { defineStore } from 'pinia'
import type { ScheduleTask } from '../interfaces'
import { SORT, PAGE_SIZE, DATA_KEY } from '../constants'

const SORT_DEFAULT = SORT.DATE_ASC

const sortByDate = function(dir: SORT) {
  switch (dir) {
    case SORT.DATE_ASC: return (prev: ScheduleTask, next: ScheduleTask) => prev.created_at - next.created_at
    case SORT.DATE_DESC: return (prev: ScheduleTask, next: ScheduleTask) => next.created_at - prev.created_at
  }
}

export const useScheduleStore = defineStore('schedule-store', {
  state: () => ({
    activePage: 0,
    sortType: SORT_DEFAULT,
    items: [] as ScheduleTask[],
  }),
  actions: {
    getListData() {
      const data = window.localStorage.getItem(DATA_KEY)
      this.items = data ? JSON.parse(data) : []  
    },
    changeSort(dir: SORT) {
      this.activePage = 0
      this.sortType = dir ?? SORT_DEFAULT
    },
    changePage(currentPage: number) {
      this.activePage = currentPage
    },
    saveList() {
      const data = JSON.stringify(this.items)
      window.localStorage.setItem(DATA_KEY, data)
    },
    updList(item: ScheduleTask) {
      const existingItem = this.items.find(({ id }) => id === item.id)
      if(!existingItem) {
        this.items = [...this.items, item]
        return
      }
      const existingItemIndex = this.items.indexOf(existingItem)
      this.items[existingItemIndex] = item
      this.items = [...this.items]
    },
    removeItems(deletionItemIds: string[]) {
      this.items = this.items.filter(({ id }) => !deletionItemIds.some(itemId => itemId === id))
    }
  },
  getters: {
    totalCount: ({ items }) => items.length,
    activeTasks: ({ items, activePage, sortType }) => {
      let list: ScheduleTask[] = []
      if (sortType === SORT.STATUS_ACTIVE ) {
        list = items.filter(({ status }) => status)
      } else if (sortType === SORT.STATUS_FINISHED) {
        list = items.filter(({ status }) => !status)
      } else {
        list = items.sort(sortByDate(sortType))
      }
      const count = list.length
      if(count < PAGE_SIZE) return { list, count }
      const activeIndex = activePage * PAGE_SIZE
      const listCount = Math.ceil(count / PAGE_SIZE)
      return { list: list.slice(activeIndex, activeIndex + PAGE_SIZE), count, listCount }
    }
  },
})
