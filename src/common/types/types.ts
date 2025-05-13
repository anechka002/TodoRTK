import { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { z } from "zod"
import { ResultCode } from "../enum/enum"

export type TasksState = {
  [key: string]: DomainTask[]
}

export type TodolistType = {
  id: string
  title: string
  filter: Filter
}

export type Filter = "all" | "active" | "completed"

export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

type FieldError = z.infer<typeof fieldErrorSchema>

export const baseResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: schema,
    resultCode: z.nativeEnum(ResultCode),
    messages: z.string().array(),
    fieldsErrors: fieldErrorSchema.array(),
})

export const defaultResponseSchema = baseResponseSchema(z.object({}))
export type DefaultResponse = z.infer<typeof defaultResponseSchema>


export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type ThemeMode = "light" | "dark"