import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import DeleteIcon from "@mui/icons-material/Delete"
import { deleteTask, updateTask } from "../../../../../model/tasks-slice"
import { ChangeEvent } from "react"
import { useAppDispatch } from "@/common/hooks"
import { EditableSpan } from "@/common/components"
// import { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { TaskStatus } from "@/common/enum"
import { RequestStatus, TasksDomainType } from "@/common/types"

type Props = {
  task: TasksDomainType
  todolistId: string
  entityStatus: RequestStatus
  disabled: boolean
}

export const TaskItem = ({ task, todolistId, entityStatus, disabled }: Props) => {
  const dispatch = useAppDispatch()

  const removeTask = () => {
    dispatch(deleteTask({ todolistId, taskId: task.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const newTask = {...task, status: newStatus}
    dispatch(updateTask(newTask))
  }

  const changeTaskTitleHandler = (title: string) => {
    const newTask = {...task, title}
    dispatch(updateTask(newTask))
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  const disabledEntityStatus = entityStatus === "loading" || disabled

  return (
    <ListItem
      sx={{
        p: 0,
        justifyContent: "space-between",
        opacity: task.status ? 0.5 : 1,
      }}
    >
      <div>
        <Checkbox disabled={disabledEntityStatus} checked={isTaskCompleted} onChange={changeTaskStatusHandler} color={"secondary"} />
        <EditableSpan disabled={disabledEntityStatus} onChange={changeTaskTitleHandler} value={task.title} />
      </div>
      <span>{new Date(task.addedDate).toLocaleDateString()}</span>
      {/* <Button onClick={removeTaskHandler}>x</Button> */}
      <IconButton disabled={disabledEntityStatus} onClick={removeTask} color="secondary">
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
