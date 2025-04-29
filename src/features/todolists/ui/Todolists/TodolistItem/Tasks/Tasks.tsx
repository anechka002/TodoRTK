import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { fetchTasks, selectTasks } from "@/features/todolists/model/tasks-slice"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { useEffect } from "react"
import { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { TaskStatus } from "@/common/enum"
import { TasksDomainType } from "@/common/types"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTasks(id))
  }, [])

  let filteredForTasks = tasks[id]

  if (filter === "active") {
    filteredForTasks = filteredForTasks.filter((el) => el.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredForTasks = filteredForTasks.filter((el) => el.status === TaskStatus.Completed)
  }

  return (
    <div>
      {filteredForTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredForTasks?.map((task: TasksDomainType) => (
            <TaskItem disabled={task.entityStatus === 'loading'} key={task.id} task={task} todolistId={id} entityStatus={entityStatus}/>
          ))}
        </List>
      )}
    </div>
  )
}
