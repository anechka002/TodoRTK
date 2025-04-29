import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { changeTodolistTitle, deleteTodolist } from "../../../../model/todolist-slice"
import s from "./TodolistTitle.module.css"
import { useAppDispatch } from "@/common/hooks"
import { EditableSpan } from "@/common/components"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const changeTodolistTitleHandler = (title: string) => {
    dispatch(changeTodolistTitle({ id: todolist.id, title }))
  }

  const deleteTodolistHandler = () => {
    dispatch(deleteTodolist(todolist.id))
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
