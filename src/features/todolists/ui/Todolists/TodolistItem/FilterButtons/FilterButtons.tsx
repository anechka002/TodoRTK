import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { Filter } from "@/common/types"
import { useAppDispatch } from "@/common/hooks"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: Filter) => {
    dispatch(
      todolistsApi.util.updateQueryData('getTodolists', undefined, (data) => {
        const newTodolist = data.find((el) => el.id === id)
        if (newTodolist) {
          newTodolist.filter = filter
        }
      })
    )
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: '10px' }}>
      <Button
        variant={filter === "all" ? "contained" : "outlined"}
        color={"secondary"}
        onClick={() => changeFilter("all")}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "contained" : "outlined"}
        color={"secondary"}
        onClick={() => changeFilter("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "contained" : "outlined"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
