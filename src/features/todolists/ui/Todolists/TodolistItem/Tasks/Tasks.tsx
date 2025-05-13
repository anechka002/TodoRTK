import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { TaskStatus } from "@/common/enum"
import { GetTasksResponseType } from "@/features/todolists/api/tasksApi.types"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useAppSelector } from "@/common/hooks"
import { selectIsTodolistCreated } from "@/app/app-slice"

type Props = {
  todolist: DomainTodolist
  tasks: GetTasksResponseType | undefined
  setPage: (page: number) => void
  page: number
  isLoading: boolean
}

export const Tasks = ({ todolist, tasks, setPage, page, isLoading }: Props) => {
  const { id, filter } = todolist

  const isTodolistCreated = useAppSelector(selectIsTodolistCreated)

  let filteredForTasks = tasks?.items

  if (filter === "active") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.Completed)
  }

  const tasksCount = filteredForTasks?.length || 0;

  if (isLoading && !isTodolistCreated ) {
    return <TasksSkeleton />
  }

  return (
    <div>
      {tasksCount === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {filteredForTasks?.map((task) => (
              <TaskItem
                page={page}
                tasksCount={tasksCount}
                setPage={setPage}
                key={task.id}
                task={task}
                todolistId={id}
              />
            ))}
          </List>
        </>
      )}
    </div>
  )
}
