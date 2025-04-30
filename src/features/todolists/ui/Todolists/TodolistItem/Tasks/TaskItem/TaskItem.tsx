import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import DeleteIcon from "@mui/icons-material/Delete"
import { ChangeEvent } from "react"
import { EditableSpan } from "@/common/components"
import { TaskStatus } from "@/common/enum"
import { RequestStatus } from "@/common/types"
import { tasksApi, useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import { createTaskModal } from "@/common/utils/createTaskModel"
import { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { useAppDispatch } from "@/common/hooks"

type Props = {
  task: DomainTask
  todolistId: string
  entityStatus: RequestStatus
  disabled: boolean
}

export const TaskItem = ({ task, todolistId, entityStatus, disabled }: Props) => {

  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const dispatch = useAppDispatch()

  const changeTaskStatus = (status: RequestStatus) => {
    dispatch(tasksApi.util.updateQueryData('getTasks', {todolistId}, (data) => {
      const taskToUpdate = data.items.find((el) => el.id === task.id)
      if(taskToUpdate) {
        taskToUpdate.entityStatus = status
      }
    }))
  }

  const removeTask = () => {
    changeTaskStatus('loading')
    deleteTask({ todolistId, taskId: task.id })
      .unwrap()
      .catch(() => {
        changeTaskStatus('idle')
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
