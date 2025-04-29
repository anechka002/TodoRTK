import { RequestStatus, TasksState } from "@/common/types"
import { createTodolist, deleteTodolist } from "./todolist-slice"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils";
import { tasksApi } from "../api/tasksApi";
import { DomainTask, domainTaskSchema, UpdateTaskModel } from "../api/tasksApi.types";
import { setAppStatus } from "@/app/app-slice";
import { ResultCode } from "@/common/enum/enum";
import { clearData } from "@/common/actions";

export const tasksSlice = createAppSlice({
  name: 'tasks',
  initialState: {} as TasksState,
  selectors: {
    selectTasks: state => state
  },
  reducers: create => ({
    // action
    changeTaskEntityStatus: create.reducer<{todoListId: string, taskId: string, entityStatus: RequestStatus}>((state, action) => {
      const tasks = state[action.payload.todoListId]
      const task = tasks.find((el) => el.id === action.payload.taskId)
      if(task) {
        task.entityStatus = action.payload.entityStatus;
      }
    }),
    // async action (thunk)
    fetchTasks: create.asyncThunk(async(todolistId: string, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        
        // await new Promise((resolve) => setTimeout(resolve, 2000)) // эмитация задержки

        const res = await tasksApi.getTasks(todolistId)
        domainTaskSchema.array().parse(res.data.items) // 💎 ZOD проверяем на валидность данных с сервера
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {tasks: res.data.items, todolistId}
      } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
      }
    }, {
      fulfilled: (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map(el => ({...el, entityStatus: 'idle'}))
      }
    }),
    createTask: create.asyncThunk(async(args: {title: string; todolistId: string}, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))

        // await new Promise((resolve) => setTimeout(resolve, 6000)) // эмитация задержки

        const res = await tasksApi.createTask(args)

        if(res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {task: res.data.data.item}
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
        const task = action.payload.task
        state[action.payload.task.todoListId].unshift({...task, entityStatus: 'idle'})
      }
    }),
    deleteTask: create.asyncThunk(async(args: {taskId: string; todolistId: string}, thunkAPI) => {
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        thunkAPI.dispatch(changeTaskEntityStatus({todoListId: args.todolistId, taskId: args.taskId, entityStatus: 'loading'}))

        // await new Promise((resolve) => setTimeout(resolve, 6000)) // эмитация задержки

        const res = await tasksApi.deleteTask(args)

        if(res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return args
        } else {
          handleServerAppError(thunkAPI.dispatch, res.data)
          return thunkAPI.rejectWithValue(null)
        }
      } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        thunkAPI.dispatch(changeTaskEntityStatus({todoListId: args.todolistId, taskId: args.taskId, entityStatus: 'failed'}))
        return thunkAPI.rejectWithValue(null)
      }
    }, {
      fulfilled: (state, action) => {
        const index = state[action.payload.todolistId].findIndex((el) => el.id === action.payload.taskId)
        if (index !== -1) {
          state[action.payload.todolistId].splice(index, 1)
        }
      }
    }),
    // changeTaskStatus: create.asyncThunk(async(task: DomainTask, thunkAPI) => {

    //   const model: UpdateTaskModel = {
    //     title: task.title,
    //     description: task.description,
    //     priority: task.priority,
    //     startDate: task.startDate,
    //     deadline: task.deadline,
    //     status: task.status
    //   }
    //   try {
    //     const res = await tasksApi.updateTask({taskId: task.id, model, todolistId: task.todoListId})
    //     return {task: res.data.data.item}
    //   } catch (error) {
    //     return thunkAPI.rejectWithValue(null)
    //   }
    // },{
    //   fulfilled: (state, action) => {
    //     const task = state[action.payload.task.todoListId].find((el) => el.id === action.payload.task.id)
    //     if (task) {
    //       task.status = action.payload.task.status ? TaskStatus.Completed : TaskStatus.New
    //     }
    //   }
    // }),
    updateTask: create.asyncThunk(async(task: DomainTask, thunkAPI) => {

      const model: UpdateTaskModel = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        status: task.status
      }
      try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        thunkAPI.dispatch(changeTaskEntityStatus({todoListId: task.todoListId, taskId: task.id, entityStatus: 'loading'}))

        // await new Promise((resolve) => setTimeout(resolve, 6000)) // эмитация задержки

        const res = await tasksApi.updateTask({taskId: task.id, model, todolistId: task.todoListId})

        if(res.data.resultCode === ResultCode.Success) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          thunkAPI.dispatch(changeTaskEntityStatus({todoListId: task.todoListId, taskId: task.id, entityStatus: 'succeeded'}))
          return {task: res.data.data.item}
        } else {
          handleServerAppError(thunkAPI.dispatch, res.data)
          thunkAPI.dispatch(changeTaskEntityStatus({todoListId: task.todoListId, taskId: task.id, entityStatus: 'failed'}))
          return thunkAPI.rejectWithValue(null)
        }
        
      } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        thunkAPI.dispatch(changeTaskEntityStatus({todoListId: task.todoListId, taskId: task.id, entityStatus: 'failed'}))
        return thunkAPI.rejectWithValue(null)
      }
    },{
      fulfilled: (state, action) => {
        const newTask = state[action.payload.task.todoListId].find((el) => el.id === action.payload.task.id)
        if (newTask) {
          Object.assign(newTask, action.payload.task)
        }
      }
    })
  }),
  extraReducers: builder => {
    builder
      .addCase(createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(clearData, () => {
        return {}
      })
  }
})

export const {deleteTask, createTask, fetchTasks, updateTask, changeTaskEntityStatus} = tasksSlice.actions

export const {selectTasks} = tasksSlice.selectors

export const tasksReducer = tasksSlice.reducer