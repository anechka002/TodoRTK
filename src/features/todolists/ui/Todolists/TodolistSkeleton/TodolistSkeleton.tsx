import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Skeleton from "@mui/material/Skeleton"
import s from "./TodolistSkeleton.module.css"

export const TodolistSkeleton = () => (
  <Paper className={s.container}>
    <div className={s.title}>
      <Skeleton width={150} height={50} />
      <Skeleton width={20} height={40} />
    </div>
    <div className={s.createItemForm}>
      <Skeleton width={230} height={60} />
      <Skeleton width={20} height={40} />
    </div>
    {Array(4)
      .fill(null)
      .map((_, id) => (
        <Box key={id} sx={{display: 'flex', justifyContent: 'space-between'}}>
          <div className={s.tasks}>
            <Skeleton width={20} height={40} />
            <Skeleton width={100} height={40} />
            <Skeleton width={100} height={40} />
          </div>
          <Skeleton width={20} height={40} />
        </Box>
      ))}
    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
      {Array(3)
        .fill(null)
        .map((_, id) => (
          <Skeleton key={id} width={80} height={60} />
        ))}
    </Box>
  </Paper>
)