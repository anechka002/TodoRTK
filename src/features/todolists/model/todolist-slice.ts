import { Filter, RequestStatus } from "@/common/types"
import { DomainTodolist, todolistSchema } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { setAppStatus } from "@/app/app-slice"
import { ResultCode } from "@/common/enum/enum"
import { clearData } from "@/common/actions"

export const todolistsSlice = createAppSlice({
  name: 'todolists',
  initialState: [] as  DomainTodolist[],
  selectors: {
    selectTodolists: state => state,
  },
  reducers: (create) => ({
    // actions
    changeTodolistFilterAC: create.reducer<{id: string; filter: Filter}>((state, action) => {
      const newTodolist = state.find((el) => el.id === action.payload.id)
      if (newTodolist) {
        newTodolist.filter = action.payload.filter
      }
    }),
    changeTodolistEntityStatusAC: create.reducer<{id: string; entityStatus: RequestStatus}>((state, action) => {
      const newTodolist = state.find((el) => el.id === action.payload.id)
      if (newTodolist) {
        newTodolist.entityStatus = action.payload.entityStatus
      }
    }),
    // async actions (thunk)
    fetchTodolist: create.asyncThunk(async(_arg, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))

        // await new Promise((resolve) => setTimeout(resolve, 2000)) // эмитация задержки

        const res = await todolistsApi.getTodolist()
        todolistSchema.array().parse(res.data) // 💎 ZOD проверяем на валидность данных с сервера
        return { todolists: res.data }
      } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
      } finally { // finally выполняется всегда
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
      }
    }, {
      fulfilled: (_state, action) => {
        return action.payload?.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: 'idle' }))
      }
    }),
    createTodolist: create.asyncThunk(async(title: string, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))

        // await new Promise((resolve) => setTimeout(resolve, 2000)) // эмитация задержки

        const res = await todolistsApi.createTodolist({title})
        if(res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {todolist: res.data.data?.item}
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
        const newTodolist: DomainTodolist = {
          ...action.payload.todolist,
          title: action.payload.todolist.title,
          filter: "all",
          entityStatus: 'idle'
        }
        state.unshift(newTodolist)
      }
    }),
    deleteTodolist: create.asyncThunk(async(id: string, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id, entityStatus: 'loading'}))

        // await new Promise((resolve) => setTimeout(resolve, 5000)) // эмитация задержки

        const res = await todolistsApi.deleteTodolist(id)
        if(res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {id}
        } else {
          handleServerAppError(thunkAPI.dispatch, res.data)
          return thunkAPI.rejectWithValue(null)
        }
      } catch (error: any) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id, entityStatus: 'failed'}))
        return thunkAPI.rejectWithValue(null)
      }
    }, {
      fulfilled: (state, action) => {
        const index = state.findIndex((el) => el.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      }
    }),
    changeTodolistTitle: create.asyncThunk(async(payload: {id: string, title: string}, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id: payload.id, entityStatus: 'loading'}))

        // await new Promise((resolve) => setTimeout(resolve, 2000)) // эмитация задержки

        const res = await todolistsApi.changeTodolistTitle(payload)
        if(res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          thunkAPI.dispatch(changeTodolistEntityStatusAC({id: payload.id, entityStatus: 'succeeded'}))
          return payload
        } else {
          handleServerAppError(thunkAPI.dispatch, res.data)
          thunkAPI.dispatch(changeTodolistEntityStatusAC({id: payload.id, entityStatus: 'failed'}))
          return thunkAPI.rejectWithValue(null)
        }
      } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id: payload.id, entityStatus: 'failed'}))
        return thunkAPI.rejectWithValue(null)
      }
    }, {
      fulfilled: (state, action) => {
        const index = state.findIndex((el) => el.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      }
    }),
  }),
  extraReducers: builder => {
    builder
      .addCase(clearData, () => {
        return []
      })
  }
})

export const todolistsReducer = todolistsSlice.reducer

export const { changeTodolistFilterAC, fetchTodolist, createTodolist, deleteTodolist, changeTodolistTitle, changeTodolistEntityStatusAC } = todolistsSlice.actions

export const {selectTodolists} = todolistsSlice.selectors
