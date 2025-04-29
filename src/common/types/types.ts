import { DomainTask } from "@/features/todolists/api/tasksApi.types"

export type TasksState = {
  [key: string]: TasksDomainType[]
}

export type TasksDomainType = DomainTask & {
  entityStatus: RequestStatus
}

export type TodolistType = {
  id: string
  title: string
  filter: Filter
}

export type Filter = "all" | "active" | "completed"

export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsError: FieldError
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type ThemeMode = "light" | "dark"