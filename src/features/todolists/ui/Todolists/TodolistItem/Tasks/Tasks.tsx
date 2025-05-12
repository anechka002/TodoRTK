import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { TaskStatus } from "@/common/enum"
import { GetTasksResponseType } from "@/features/todolists/api/tasksApi.types"

type Props = {
  todolist: DomainTodolist
  tasks: GetTasksResponseType | undefined
  setPage: (page: number) => void
  page: number
}

export const Tasks = ({ todolist, tasks, setPage, page }: Props) => {
  const { id, filter, entityStatus } = todolist

  let filteredForTasks = tasks?.items

  if (filter === "active") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.Completed)
  }

  const tasksCount = filteredForTasks?.length || 0;

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
                disabled={task.entityStatus === "loading"}
                key={task.id}
                task={task}
                todolistId={id}
                entityStatus={entityStatus}
              />
            ))}
          </List>
        </>
      )}
    </div>
  )
}
