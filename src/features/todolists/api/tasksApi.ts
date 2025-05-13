import { DefaultResponse, defaultResponseSchema } from "@/common/types";
import { GetTasksResponseType, getTasksSchema, TaskOperationResponse, taskOperationResponseSchema, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi"
import { PAGE_SIZE } from "@/common/constants.ts";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponseType, {todolistId: string, params: { page: number}}>({
      query: ({todolistId, params}) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        params: {...params, count: PAGE_SIZE}
      }),
      extraOptions: { dataSchema: getTasksSchema }, // ZOD
      providesTags: (_result, _error, {todolistId}) => [{type: 'Task', id: todolistId}],
    }),

    createTask: builder.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      query: ({todolistId, title}) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: 'POST',
        body: {title}
      }),
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: (_result, _error, {todolistId}) => [{type: 'Task', id: todolistId}]
    }),

    deleteTask: builder.mutation<DefaultResponse, { todolistId: string; taskId: string }>({
      query: ({todolistId, taskId}) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ todolistId, taskId }, { dispatch, queryFulfilled, getState }) {
        const args = tasksApi.util.selectCachedArgsForQuery(getState(), 'getTasks');

        let patchResult: any[] = [];
        args.forEach(({params}) => {
          patchResult.push(
            dispatch(
              tasksApi.util.updateQueryData('getTasks', {todolistId, params: { page: params.page }}, state => {
                const index = state.items.findIndex(task => task.id === taskId)
                if (index !== -1) {
                  state.items.splice(index, 1);
                }
              })
            )
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResult.forEach((el) => {
            el.undo()
          })
        }
      },
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: (_result, _error, {todolistId}) => [{ type: 'Task', id: todolistId }],
    }),

    updateTask: builder.mutation<TaskOperationResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
      query: ({todolistId, taskId, model}) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'PUT',
        body: model
      }),
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        const args = tasksApi.util.selectCachedArgsForQuery(getState(), 'getTasks');

        let patchResult: any[] = [];
        args.forEach(({params}) => {
          patchResult.push(
            dispatch(
              tasksApi.util.updateQueryData('getTasks', {todolistId, params: { page: params.page }}, state => {
                const index = state.items.findIndex(task => task.id === taskId)
                if (index !== -1) {
                  state.items[index] = { ...state.items[index], ...model }
                }
              })
            )
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResult.forEach((el) => {
            el.undo()
          })
        }
      },
      extraOptions: { dataSchema: taskOperationResponseSchema }, 
      invalidatesTags: (_result, _error, {todolistId}) => [{ type: 'Task', id: todolistId }],
    }),
    
  })
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi
