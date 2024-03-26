import type { Ref } from 'vue'
import { DATA_KEY, DATE_MONTH, minsToMils } from "../constants"

const processDate = function(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    const monthTxt = `${DATE_MONTH[Number(month) - 1]}.`;
    const yearTxt = `${year} г.`
    return [day, monthTxt, yearTxt].join(' ');
}

const processTime = function(timeStr: string) {
    const [hour, minutes] = timeStr.split(':');
    return `${hour}ч. ${minutes}мин.`;
}

export const loadAllTasks = function() {
    const data = window.localStorage.getItem(DATA_KEY);
    return data ? JSON.parse(data) : [];
}

export function getReadableDate(timeMS: number) {
    const zoneOffset = (new Date).getTimezoneOffset() * minsToMils;
    const taskDate = (new Date(timeMS - zoneOffset)).toISOString();
    const [date, time] = taskDate.split('T');
    const taskDateTxt = processDate(date);
    const taskTimeTxt = processTime(time);
    return [taskDateTxt, taskTimeTxt].join(' - ');
}

export function hideOnclickOutside(evt: MouseEvent, eltRef: Ref<HTMLElement>, callback: Function) {
    const path = evt.composedPath()
    const elt = eltRef.value;
    if(!elt) {
        return;
    }
    if(!path.includes(elt)) {
        callback();
    }
}

export const generateId = function() {
  const now = performance.now()
  const nowInteger = Math.trunc(now)
  const nowDecimal = Math.trunc(Math.random() * 1E6)
  return Math.round((nowInteger ^ nowDecimal) * 16 ).toString(16)
}