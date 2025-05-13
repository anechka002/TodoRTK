import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import DeleteIcon from "@mui/icons-material/Delete"
import { ChangeEvent } from "react"
import { EditableSpan } from "@/common/components"
import { TaskStatus } from "@/common/enum"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import { createTaskModal } from "@/common/utils/createTaskModel"
import { DomainTask } from "@/features/todolists/api/tasksApi.types"

type Props = {
  task: DomainTask
  todolistId: string
  setPage: (page: number) => void
  tasksCount: number
  page: number
}

export const TaskItem = ({ task, todolistId, setPage, tasksCount, page }: Props) => {

  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const removeTask = () => {
    deleteTask({ todolistId, taskId: task.id })
    .unwrap()
    .then(() => {
        // после удаления последней задачи на странице, переключаемся на последнюю валидную страницу
      if (tasksCount === 1 ) {
        setPage(page > 1 ? page - 1 : 1)
      }
    })
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModal(task, {status})
    updateTask({todolistId, taskId: task.id, model})
  }

  const changeTaskTitleHandler = (title: string) => {
    const model = createTaskModal(task, {title})
    updateTask({todolistId, taskId: task.id, model})
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem
      sx={{
        p: 0,
        justifyContent: "space-between",
        opacity: task.status ? 0.5 : 1,
      }}
    >
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatusHandler} color={"secondary"} />
        <EditableSpan onChange={changeTaskTitleHandler} value={task.title} />
      </div>
      <span>{new Date(task.addedDate).toLocaleDateString()}</span>
      {/* <Button onClick={removeTaskHandler}>x</Button> */}
      <IconButton onClick={removeTask} color="secondary">
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
