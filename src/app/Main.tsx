import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"
import { useAppDispatch } from "@/common/hooks"
import { setIsTodolistCreated } from "./app-slice"

export const Main = () => {

  const [addTodolist] = useAddTodolistMutation()

  const dispatch = useAppDispatch()

  const addTodolistHandler = async (title: string) => {
    const result = await addTodolist({title})
    if(result.data) {
      dispatch(setIsTodolistCreated(true))
    }
  }

  return (
    <Container maxWidth={"xl"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={addTodolistHandler} />
      </Grid>

      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
