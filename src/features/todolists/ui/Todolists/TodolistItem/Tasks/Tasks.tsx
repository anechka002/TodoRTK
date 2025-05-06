import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { TaskStatus } from "@/common/enum"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useEffect, useState } from "react"
import { TasksPagination } from "./TasksPagination/TasksPagination"
import { useAppDispatch } from "@/common/hooks"
import { setTasksLoading } from "@/app/app-slice"
import LinearProgress from "@mui/material/LinearProgress"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const [page, setPage] = useState(1)

  const { data: tasks, isLoading, isFetching } = useGetTasksQuery({ todolistId: id, params: { page } }, {refetchOnFocus: true, pollingInterval: 3000, skipPollingIfUnfocused: true})
  // refetchOnFocus: true, // для автоматического повторного запроса за данными, когда окно приложения или вкладка браузера возвращаются в фокус.
  // Polling позволяет автоматически повторять запросы через определённые интервалы времени для поддержания актуальности данных.

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoading) {
      dispatch(setTasksLoading(isFetching))
    }
  }, [isFetching, isLoading])

  let filteredForTasks = tasks?.items

  if (filter === "active") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <div>
      {/* {isFetching && <LinearProgress />} */}
      {filteredForTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {filteredForTasks?.map((task) => (
              <TaskItem
                disabled={task.entityStatus === "loading"}
                key={task.id}
                task={task}
                todolistId={id}
                entityStatus={entityStatus}
              />
            ))}
          </List>
          <TasksPagination page={page} setPage={setPage} totalCount={tasks?.totalCount || 0} />
        </>
      )}
    </div>
  )
}
