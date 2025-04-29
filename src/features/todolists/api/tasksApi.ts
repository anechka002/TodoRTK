import { DomainTask, GetTasksResponse, GetTasksResponseType, UpdateTaskModel } from "./tasksApi.types"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponseType, {todolistId: string}>({
      query: ({todolistId}) => `/todo-lists/${todolistId}/tasks`,
      transformResponse (tasks: GetTasksResponse): GetTasksResponseType{
        return {
          ...tasks,
          items: tasks.items.map(el => ({...el, entityStatus: 'idle'}))
        }
      },
      providesTags: ['Task']
    }),
    createTask: builder.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({todolistId, title}) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: 'POST',
        body: {title}
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({todolistId, taskId}) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<BaseResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
      query: ({todolistId, taskId, model}) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'PUT',
        body: model
      }),
      invalidatesTags: ['Task'],
    }),
    
  })
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi
