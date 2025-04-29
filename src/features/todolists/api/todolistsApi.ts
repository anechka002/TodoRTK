import { DomainTodolist, Todolist } from "./todolistsApi.types"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodolists: builder.query<DomainTodolist[], void>({
      query: () => 'todo-lists',
      transformResponse: (todolists: Todolist[]): DomainTodolist[] => 
        todolists.map(todo => ({...todo, filter: 'all', entityStatus: 'idle'})),
      providesTags: ['Todolist']
    }),
    addTodolist: builder.mutation<BaseResponse<{ item: Todolist }>, { title: string }>({
      query: ({title}) => ({
        url: '/todo-lists',
        method: 'POST',
        body: {title}
      }),
      invalidatesTags: ['Todolist'],
    }),
    deleteTodolist: builder.mutation<BaseResponse, { id: string }>({
      query: ({id}) => ({
        url: `/todo-lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todolist'],
    }),
    updateTodolistTitle: builder.mutation<BaseResponse, { id: string; title: string }>({
      query: ({id, title}) => ({
        url: `/todo-lists/${id}`,
        method: 'PUT',
        body: {title}
      }),
      invalidatesTags: ['Todolist'],
    }),
  })
})

export const { useGetTodolistsQuery, useAddTodolistMutation, useDeleteTodolistMutation, useUpdateTodolistTitleMutation } = todolistsApi

