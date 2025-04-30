import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useGetTodolistsQuery } from "../../api/todolistsApi"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import Box from "@mui/material/Box"

export const Todolists = () => {

  const {data: todolists, isLoading} = useGetTodolistsQuery()

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
