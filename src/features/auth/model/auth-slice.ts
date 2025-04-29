import { setAppStatus } from "@/app/app-slice"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { authApi } from "../api/authApi"
import { Inputs } from "../lib/shemas"
import { ResultCode } from "@/common/enum/enum"
import { AUTH_TOKEN } from "@/common/constants.ts"
import { authSchema } from "../lib/shemas/authSchema"
import { clearData } from "@/common/actions"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    login: create.asyncThunk(
      async (arg: Inputs, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatus({ status: "loading" }))

          // await new Promise((resolve) => setTimeout(resolve, 2000)) // эмитация задержки

          const res = await authApi.login(arg)
          authSchema.parse(res.data.data) // 💎 ZOD проверяем на валидность данных с сервера
          if (res.data.resultCode === ResultCode.Success) {
            thunkAPI.dispatch(setAppStatus({ status: "succeeded" }))

            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return { isLoggedIn: true }
          } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
            return thunkAPI.rejectWithValue(null)
          }
        } catch (error) {
          // handleServerNetworkError(thunkAPI.dispatch, error)
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logout: create.asyncThunk(async (_arg, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({ status: "loading" }))
        const res = await authApi.logout()

        if (res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({ status: "succeeded" }))

          localStorage.removeItem(AUTH_TOKEN)

          thunkAPI.dispatch(clearData())

          return { isLoggedIn: false }
        } else {
          handleServerAppError(thunkAPI.dispatch, res.data)
          return thunkAPI.rejectWithValue(null)
        }
      } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
      }
    }, {
      fulfilled: (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      }
    }),
    initialize: create.asyncThunk(async (_arg, thunkAPI) => {
      try {
        // debugger
        thunkAPI.dispatch(setAppStatus({ status: "loading" }))
        const res = await authApi.me()
        // debugger
        if (res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({ status: "succeeded" }))
          // debugger
          // console.log(current('initialize'))
          return { isLoggedIn: true }
        } else {
          handleServerAppError(thunkAPI.dispatch, res.data)
          // debugger
          return thunkAPI.rejectWithValue(null)
        }
      } catch (error) {
        // debugger
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
      }
    }, {
      fulfilled: (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      }
    })
  }),
})

export const authReducer = authSlice.reducer

export const {login, logout, initialize} = authSlice.actions

export const { selectIsLoggedIn } = authSlice.selectors
