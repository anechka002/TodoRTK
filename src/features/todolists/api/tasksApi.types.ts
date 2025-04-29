import { TaskPriority, TaskStatus } from "@/common/enum"
import { z } from "zod"

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

export type GetTasksResponse = {
  items: DomainTask[]
  totalCount: number
  error: string | null
}

export type UpdateTaskModel = {
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}