import { RequestStatus, ThemeMode } from "@/common/types"
import { tasksApi } from "@/features/todolists/api/tasksApi"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    themeMode: "light" as ThemeMode,
    status: 'idle' as RequestStatus,
    error: null as (string | null), 
    isLoggedIn: false,
  },
  selectors: {
    selectThemeMode: state => state.themeMode,
    selectStatus: state => state.status,
    selectError: state => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode}>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatus: create.reducer<{ status: RequestStatus}>((state, action) => {
      state.status = action.payload.status
    }),
    setAppError: create.reducer<{ error: null | string}>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return
        }
          state.status = 'loading'
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejected, (state) => {
        state.status = 'failed'
      })
  }
})
export const appReducer = appSlice.reducer

export const { changeThemeModeAC, setAppStatus, setAppError, setIsLoggedIn } = appSlice.actions

export const { selectThemeMode, selectStatus, selectError, selectIsLoggedIn } = appSlice.selectors
