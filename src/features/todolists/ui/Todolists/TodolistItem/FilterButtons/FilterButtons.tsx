import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
// import { changeTodolistFilterAC } from "../../../../model/todolist-slice"
import { Filter } from "@/common/types"
import { useAppDispatch } from "@/common/hooks"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: Filter) => {
    // dispatch(changeTodolistFilterAC({ id, filter }))
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        variant={filter === "all" ? "contained" : "outlined"}
        color={"secondary"}
        onClick={() => changeFilter("all")}
        disabled={entityStatus === "loading"}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "contained" : "outlined"}
        color={"secondary"}
        onClick={() => changeFilter("active")}
        disabled={entityStatus === "loading"}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "contained" : "outlined"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
        disabled={entityStatus === "loading"}
      >
        Completed
      </Button>
    </Box>
  )
}
