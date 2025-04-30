import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import s from "./TodolistTitle.module.css"
import { EditableSpan } from "@/common/components"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { todolistsApi, useDeleteTodolistMutation, useUpdateTodolistTitleMutation } from "@/features/todolists/api/todolistsApi"
import { useAppDispatch } from "@/common/hooks"
import { RequestStatus } from "@/common/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [updateTodolist] = useUpdateTodolistTitleMutation()

  const dispatch = useAppDispatch()

  const changeTodolistTitleHandler = (title: string) => {
    updateTodolist({ id: todolist.id, title })
  }

  const changeTodolistStatus = (status: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData('getTodolists', undefined, (data) => {
        const newTodolist = data.find((el) => el.id === todolist.id)
        if (newTodolist) {
          newTodolist.entityStatus = status
        }
      })
    )
  }

  const deleteTodolistHandler = () => {
    changeTodolistStatus('loading')
    deleteTodolist({id: todolist.id})
      .unwrap()
      .catch(() => {
        changeTodolistStatus('idle')
      })
  }

  return (
    <div className={s.container}>
      <h3>
        <EditableSpan disabled={todolist.entityStatus === 'loading'} value={todolist.title} onChange={changeTodolistTitleHandler} />
      </h3>
      <IconButton disabled={todolist.entityStatus === 'loading'} onClick={deleteTodolistHandler} color="secondary">
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
