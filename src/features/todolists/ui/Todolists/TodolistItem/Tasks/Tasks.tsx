import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { TaskStatus } from "@/common/enum"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const {data: tasks, isLoading} = useGetTasksQuery({todolistId: id})

  let filteredForTasks = tasks?.items

  if (filter === "active") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.Completed)
  }

  if(isLoading) {
    return <TasksSkeleton/>
  }

  return (
    <div>
      {filteredForTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredForTasks?.map((task) => (
            <TaskItem disabled={task.entityStatus === 'loading'} key={task.id} task={task} todolistId={id} entityStatus={entityStatus}/>
          ))}
        </List>
      )}
    </div>
  )
}
