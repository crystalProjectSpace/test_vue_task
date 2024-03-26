import { PRIORITY, STATUS } from '../enums';

export interface ScheduleTask {
    id: string,
    created_at: number,
    updated_at: number,
    name: string,
    description: string,
    responsible_id: string,
    priority: PRIORITY,
    dependant_task_ids?: string[],
    status: boolean,
}

export interface TaskCheckEvt {
    taskId: string,
    isChecked: boolean,
}

export interface SelectOptions {
    label: string;
    value: string | number;
}

export type TaskFields = 'id' |
    'created_at' |
    'updated_at' |
    'name' |
    'description' |
    'responsible_id' |
    'priority' |
    'dependant_task_ids' |
    'status';
