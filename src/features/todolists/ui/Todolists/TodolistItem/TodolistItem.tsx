import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { Tasks } from "./Tasks/Tasks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { CreateItemForm } from "@/common/components"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {

  const [createTask] = useCreateTaskMutation()

  const createTaskHandler = (title: string) => {
    createTask({ todolistId: todolist.id, title })
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
