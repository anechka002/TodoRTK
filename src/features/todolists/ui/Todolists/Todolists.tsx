import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { useGetTodolistsQuery } from "../../api/todolistsApi"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import Box from "@mui/material/Box"
import { useReorderTodolistMutation } from "../../api/todolistsApi"
import { SortableTodolistItem } from "./SortableTodolistItem"

export const Todolists = () => {
  const {data: todolists, isLoading} = useGetTodolistsQuery()
  const [reorderTodolist] = useReorderTodolistMutation()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!todolists || !over || active.id === over.id) {
      return
    }

    const oldIndex = todolists.findIndex((todolist) => todolist.id === active.id)
    const newIndex = todolists.findIndex((todolist) => todolist.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const reordered = arrayMove(todolists, oldIndex, newIndex)
    const movedIndex = reordered.findIndex((todolist) => todolist.id === active.id)
    const putAfterItemId = movedIndex === 0 ? null : reordered[movedIndex - 1].id

    reorderTodolist({ id: String(active.id), putAfterItemId, oldIndex, newIndex })
  }

  if(isLoading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
        ))}
      </Box>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todolists?.map((todolist) => todolist.id) ?? []} strategy={rectSortingStrategy}>
        {todolists?.map((todolist) => <SortableTodolistItem key={todolist.id} todolist={todolist} />)}
      </SortableContext>
    </DndContext>
  )
}
