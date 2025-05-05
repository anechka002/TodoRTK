import { DefaultResponse, defaultResponseSchema } from "@/common/types";
import { CreateTodolistResponse, createTodolistResponseSchema, DomainTodolist, Todolist, todolistSchema } from "./todolistsApi.types"
import { baseApi } from "@/app/baseApi"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodolists: builder.query<DomainTodolist[], void>({
      query: () => 'todo-lists',
      transformResponse: (todolists: Todolist[]): DomainTodolist[] => 
        todolists.map(todo => ({...todo, filter: 'all', entityStatus: 'idle'})),
      extraOptions: { dataSchema:  todolistSchema.array()}, // ZOD
      providesTags: ['Todolist']
    }),
    addTodolist: builder.mutation<CreateTodolistResponse, { title: string }>({
      query: ({title}) => ({
        url: '/todo-lists',
        method: 'POST',
        body: {title}
      }),
      extraOptions: { dataSchema:  createTodolistResponseSchema}, // ZOD
      invalidatesTags: ['Todolist'],
    }),
    deleteTodolist: builder.mutation<DefaultResponse, { id: string }>({
      query: ({id}) => ({
        url: `/todo-lists/${id}`,
        method: 'DELETE',
      }),
      extraOptions: { dataSchema:  defaultResponseSchema}, // ZOD
      invalidatesTags: ['Todolist'],
    }),
    updateTodolistTitle: builder.mutation<DefaultResponse, { id: string; title: string }>({
      query: ({id, title}) => ({
        url: `/todo-lists/${id}`,
        method: 'PUT',
        body: {title}
      }),
      extraOptions: { dataSchema:  defaultResponseSchema}, // ZOD
      invalidatesTags: ['Todolist'],
    }),
  })
})

export const { useGetTodolistsQuery, useAddTodolistMutation, useDeleteTodolistMutation, useUpdateTodolistTitleMutation } = todolistsApi

