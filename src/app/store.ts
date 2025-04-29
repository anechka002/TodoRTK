import { configureStore } from "@reduxjs/toolkit"
import { appReducer, appSlice } from "./app-slice"
import { todolistsReducer, todolistsSlice } from "@/features/todolists/model/todolist-slice"
import { tasksReducer, tasksSlice } from "@/features/todolists/model/tasks-slice"
import { authReducer, authSlice } from "@/features/auth/model/auth-slice"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "./baseApi"

// создание store
export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [authSlice.name]: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
