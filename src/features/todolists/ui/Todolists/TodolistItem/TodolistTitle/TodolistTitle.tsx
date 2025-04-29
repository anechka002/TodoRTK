import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import s from "./TodolistTitle.module.css"
import { EditableSpan } from "@/common/components"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { useDeleteTodolistMutation, useUpdateTodolistTitleMutation } from "@/features/todolists/api/todolistsApi"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [updateTodolist] = useUpdateTodolistTitleMutation()

  const changeTodolistTitleHandler = (title: string) => {
    updateTodolist({ id: todolist.id, title })
  }

  const deleteTodolistHandler = () => {
    deleteTodolist({id: todolist.id})
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
