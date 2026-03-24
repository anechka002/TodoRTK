import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import IconButton from "@mui/material/IconButton"
import DragIndicator from "@mui/icons-material/DragIndicator"
import Box from "@mui/material/Box"
import { TaskItem } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx"

type Props = {
  task: DomainTask
  todolistId: string
  setPage: (page: number) => void
  tasksCount: number
  page: number
}

export const SortableTaskItem = ({
  task,
  setPage,
  page,
  tasksCount,
  todolistId,
}: Props) => {
  const { attributes, listeners, setNodeRef, isDragging, transition, transform } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        size="small"
        sx={{
          mt: 0.5,
          cursor: isDragging ? "grabbing" : "grab",
          flexShrink: 0,
        }}
        aria-label={`Move task ${task.title}`}
      >
        <DragIndicator />
      </IconButton>

      <Box sx={{ flex: 1 }}>
        <TaskItem page={page} tasksCount={tasksCount} setPage={setPage} task={task} todolistId={todolistId} />
      </Box>
    </Box>
  )
}