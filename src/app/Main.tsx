import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { useAppDispatch } from "../common/hooks/useAppDispatch"
import { createTodolist } from "@/features/todolists/model/todolist-slice"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"

export const Main = () => {
  const dispatch = useAppDispatch()

  const addTodolist = (title: string) => {
    dispatch(createTodolist(title))
  }

  return (
    <Container maxWidth={"xl"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={addTodolist} />
      </Grid>

      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
