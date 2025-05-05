import { TaskPriority, TaskStatus } from "@/common/enum"
import { TasksDomainType } from "@/common/types"
import { z } from "zod"
import { baseResponseSchema } from '@/common/types';

// export type DomainTask = {
//   description: string | null
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
//   startDate: string | null
//   deadline: string | null
//   id: string
//   todoListId: string
//   order: number
//   addedDate: string
// }

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.string().datetime({ local: true })
})

export type DomainTask = z.infer<typeof domainTaskSchema>

export const getTasksSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int().nonnegative(),
  items: domainTaskSchema.array(),
})

export type GetTasksResponse = z.infer<typeof getTasksSchema>

export type GetTasksResponseType = {
  items: TasksDomainType[]
  totalCount: number
  error: string | null
}

// create and update task
export const taskOperationResponseSchema = baseResponseSchema(
  z.object({
    item: domainTaskSchema,
  }),
)
export type TaskOperationResponse = z.infer<typeof taskOperationResponseSchema>

export type UpdateTaskModel = {
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}