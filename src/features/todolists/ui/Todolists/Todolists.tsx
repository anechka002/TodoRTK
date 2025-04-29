import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useGetTodolistsQuery } from "../../api/todolistsApi"

export const Todolists = () => {

  const {data: todolists} = useGetTodolistsQuery()

  return (
    <>
      {todolists?.map((td) => {
        return (
          <Grid key={td.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
              <TodolistItem todolist={td} />
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
