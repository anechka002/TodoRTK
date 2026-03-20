import { DefaultResponse, defaultResponseSchema } from "@/common/types";
import { CreateTodolistResponse, createTodolistResponseSchema, DomainTodolist, Todolist, todolistSchema } from "./todolistsApi.types"
import { baseApi } from "@/app/baseApi"
import { arrayMove } from "@dnd-kit/sortable"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodolists: builder.query<DomainTodolist[], void>({
      query: () => 'todo-lists',
      transformResponse: (todolists: Todolist[]): DomainTodolist[] => 
        todolists.map(todo => ({...todo, filter: 'all'})),
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
      query: ({id}) => {
        // 4
        return { 
        url: `/todo-lists/${id}`,
        method: 'DELETE',
        }
      },    
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // 1
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData('getTodolists', undefined, state => {
            // 2
            const index = state.findIndex(todolist => todolist.id === id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          })
        )
        try {
          // 3
          await queryFulfilled
        } catch {
          // 5
          patchResult.undo()
        }
      },
      extraOptions: { dataSchema:  defaultResponseSchema}, // ZOD
      invalidatesTags: ['Todolist'],
    }),
    updateTodolistTitle: builder.mutation<DefaultResponse, { id: string; title: string }>({
      query: ({id, title}) => ({
        url: `/todo-lists/${id}`,
        method: 'PUT',
        body: {title}
      }),
      async onQueryStarted({ id, title }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData('getTodolists', undefined, state => {
            const index = state.findIndex(todolist => todolist.id === id)
            if (index !== -1) {
              state[index].title = title
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      extraOptions: { dataSchema:  defaultResponseSchema}, // ZOD
      invalidatesTags: ['Todolist'],
    }),
    reorderTodolist: builder.mutation<
      DefaultResponse,
      { id: string; putAfterItemId: string | null; oldIndex: number; newIndex: number }
    >({
      query: ({ id, putAfterItemId }) => ({
        url: `/todo-lists/${id}/reorder`,
        method: 'PUT',
        body: { putAfterItemId },
      }),
      async onQueryStarted({ oldIndex, newIndex }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData('getTodolists', undefined, state => {
            const reordered = arrayMove(state, oldIndex, newIndex)

            state.splice(0, state.length, ...reordered)

            state.forEach((todolist, index) => {
              todolist.order = index
            })
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: ['Todolist'],
    }),
  })
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useDeleteTodolistMutation,
  useUpdateTodolistTitleMutation,
  useReorderTodolistMutation,
} = todolistsApi
