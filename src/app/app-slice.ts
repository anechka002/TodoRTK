import { RequestStatus, ThemeMode } from "@/common/types"
import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    themeMode: "light" as ThemeMode,
    status: 'idle' as RequestStatus,
    error: null as (string | null), 
  },
  selectors: {
    selectThemeMode: state => state.themeMode,
    selectStatus: state => state.status,
    selectError: state => state.error,
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
  })
})
export const appReducer = appSlice.reducer

export const { changeThemeModeAC, setAppStatus, setAppError } = appSlice.actions

export const { selectThemeMode, selectStatus, selectError } = appSlice.selectors
