import { DefaultResponse, defaultResponseSchema } from "@/common/types";
import { GetTasksResponse, GetTasksResponseType, getTasksSchema, TaskOperationResponse, taskOperationResponseSchema, UpdateTaskModel } from "./tasksApi.types"
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
      extraOptions: { dataSchema: getTasksSchema }, // ZOD
      providesTags: ['Task']
    }),
    createTask: builder.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      query: ({todolistId, title}) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: 'POST',
        body: {title}
      }),
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<DefaultResponse, { todolistId: string; taskId: string }>({
      query: ({todolistId, taskId}) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'DELETE',
      }),
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<TaskOperationResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
      query: ({todolistId, taskId, model}) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'PUT',
        body: model
      }),
      extraOptions: { dataSchema: taskOperationResponseSchema }, 
      invalidatesTags: ['Task'],
    }),
    
  })
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi
