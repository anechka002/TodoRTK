import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { useEffect } from "react"
import { fetchTodolist, selectTodolists } from "../../model/todolist-slice"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolist())
  }, [])

  return (
    <>
      {todolists.map((td) => {
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
