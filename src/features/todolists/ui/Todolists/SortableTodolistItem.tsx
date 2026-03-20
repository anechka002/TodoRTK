import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import DragIndicator from "@mui/icons-material/DragIndicator"
import Grid from "@mui/material/Grid2"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import { DomainTodolist } from "../../api/todolistsApi.types"
import { TodolistItem } from "./TodolistItem/TodolistItem"

type Props = {
  todolist: DomainTodolist
}

export const SortableTodolistItem = ({ todolist }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todolist.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <Grid>
      <Paper ref={setNodeRef} style={style} sx={{ p: "0 20px 20px 20px", position: "relative" }}>
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, cursor: isDragging ? "grabbing" : "grab" }}
          aria-label={`Move todolist ${todolist.title}`}
        >
          <DragIndicator />
        </IconButton>

        <TodolistItem todolist={todolist} />
      </Paper>
    </Grid>
  )
}
