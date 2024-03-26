import type { ScheduleTask } from "../interfaces"
import { PRIORITY } from ".";

export const DATA_KEY = 'stored-tasks'

export const NEW_TASK_ID = 'new'

export const SELECTION_KEY = 'selection-list'

export const DUMMY_TASK: ScheduleTask = {
    id: '',
    created_at: 0,
    updated_at: 0,
    name: 'Новая задача',
    description: 'Описание новой задачи',
    responsible_id: '',
    priority: PRIORITY.MEDIUM,
    dependant_task_ids: [],
    status: true,
};

export const DATE_MONTH = ['янв','фев','мар','апр','май','июн','июл','авг','септ','окт','нояб','дек'];
