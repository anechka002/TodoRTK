import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { Tasks } from "./Tasks/Tasks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { CreateItemForm } from "@/common/components"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { useCreateTaskMutation, useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import { PAGE_SIZE } from "@/common/constants.ts"
import { TasksPagination } from "./Tasks/TasksPagination/TasksPagination"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectIsTodolistCreated, setAppStatus } from "@/app/app-slice"
import { TasksSkeleton } from "./Tasks/TasksSkeleton/TasksSkeleton"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {

  const [page, setPage] = useState(1)

  const dispatch = useAppDispatch()

  const isTodolistCreated = useAppSelector(selectIsTodolistCreated)

  const [createTask] = useCreateTaskMutation()

  const { data: tasks, isLoading, isFetching, } = useGetTasksQuery({ todolistId: todolist.id, params: { page }})
  // {refetchOnFocus: true, pollingInterval: 3000, skipPollingIfUnfocused: true}
  // refetchOnFocus: true, // для автоматического повторного запроса за данными, когда окно приложения или вкладка браузера возвращаются в фокус.
  // Polling позволяет автоматически повторять запросы через определённые интервалы времени для поддержания актуальности данных.
  

  useEffect(() => {
    // Если isLoading ложно, это значит, что данные уже загружены.
    if (!isLoading && isFetching) {
      // Обновляем состояние загрузки для пагинации
      dispatch(setAppStatus({status: 'loading'}))
    } else if(!isFetching) {
      dispatch(setAppStatus({status: 'idle'}))
    }
  }, [isFetching, isLoading])

  const createTaskHandler = (title: string) => {
    createTask({ todolistId: todolist.id, title })
    setPage(1)
  }
  
  if (isLoading && !isTodolistCreated ) {
    return <TasksSkeleton />
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />

      <CreateItemForm disabled={todolist.entityStatus === 'loading'} onCreateItem={createTaskHandler} />

      <Tasks page={page} setPage={setPage} tasks={tasks} todolist={todolist} />

      {tasks && tasks?.totalCount > PAGE_SIZE && (
        <TasksPagination page={page} setPage={setPage} totalCount={tasks.totalCount} />
      )}

      <FilterButtons todolist={todolist} />
    </div>
  )
}
