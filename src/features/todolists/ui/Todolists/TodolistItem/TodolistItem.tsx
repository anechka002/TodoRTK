import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { Tasks } from "./Tasks/Tasks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { useAppDispatch } from "@/common/hooks"
import { CreateItemForm } from "@/common/components"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { createTask } from "@/features/todolists/model/tasks-slice"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const createTaskHandler = (title: string) => {
    dispatch(createTask({ todolistId: todolist.id, title }))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />

      <CreateItemForm disabled={todolist.entityStatus === 'loading'} onCreateItem={createTaskHandler} />

      <Tasks todolist={todolist} />

      <FilterButtons todolist={todolist} />
    </div>
  )
}
