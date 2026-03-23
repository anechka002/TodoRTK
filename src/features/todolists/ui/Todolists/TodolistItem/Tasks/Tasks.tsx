import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { TaskStatus } from "@/common/enum"
import { GetTasksResponseType } from "@/features/todolists/api/tasksApi.types"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useAppSelector } from "@/common/hooks"
import { selectIsTodolistCreated } from "@/app/app-slice"
import { useReorderTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableTaskItem
} from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/SortableTaskItem.tsx"

type Props = {
  todolist: DomainTodolist
  tasks: GetTasksResponseType | undefined
  setPage: (page: number) => void
  page: number
  isLoading: boolean
}

export const Tasks = ({ todolist, tasks, setPage, page, isLoading }: Props) => {
  const { id, filter } = todolist

  const isTodolistCreated = useAppSelector(selectIsTodolistCreated)

  const [reorderTask] = useReorderTaskMutation()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!id || !tasks?.items || !over || active.id === over.id || filter !== 'all') {
      return
    }

    const oldIndex = tasks.items.findIndex((task) => task.id === active.id)
    const newIndex = tasks.items.findIndex((task) => task.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const reordered = arrayMove(tasks.items, oldIndex, newIndex)
    const movedIndex = reordered.findIndex((task) => task.id === active.id)
    const putAfterItemId = movedIndex === 0 ? null : reordered[movedIndex - 1].id

    reorderTask({ todolistId: id, taskId: String(active.id), putAfterItemId, oldIndex, newIndex })
  }

  let filteredForTasks = tasks?.items

  if (filter === "active") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredForTasks = filteredForTasks?.filter((el) => el.status === TaskStatus.Completed)
  }

  const tasksCount = filteredForTasks?.length || 0;
  const isSortable = filter === 'all'

  if (isLoading && !isTodolistCreated ) {
    return <TasksSkeleton />
  }

  if (tasksCount === 0) {
    return <p>Тасок нет</p>
  }

  if (!isSortable) {
    return (
      <List>
        {filteredForTasks?.map((task) => (
          <TaskItem page={page} tasksCount={tasksCount} setPage={setPage} key={task.id} task={task} todolistId={id} />
        ))}
      </List>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={tasks?.items.map((t) => t.id) ?? []} strategy={verticalListSortingStrategy}>
        <List>
          {tasks?.items.map((task) => (
            <SortableTaskItem
              page={page}
              tasksCount={tasks.items.length}
              setPage={setPage}
              key={task.id}
              task={task}
              todolistId={id}
            />
          ))}
        </List>
      </SortableContext>
    </DndContext>
  )
}
