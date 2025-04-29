import { Button } from '@mui/material'
import s from './PageNotFound.module.css'
import { PATH } from '@/common/routing/Routing'
import { Link } from 'react-router'

export const PageNotFound = () => {
  return (
    <div className={s.content}>
      <h1 className={s.title}>404</h1>
      <h2 className={s.subtitle}>page not found</h2>
      <Button sx={{minWidth: 400}} color={"secondary"} variant="contained" component={Link} to={PATH.MAIN}>Go to main page</Button>
    </div>
  )
}
