import "./App.css"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Header } from "@/common/components"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { selectThemeMode, setIsLoggedIn } from "./app-slice"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar"
import { Routing } from "@/common/routing"
import { useEffect, useState } from "react"
import CircularProgress from "@mui/material/CircularProgress"
import s from "./App.module.css"
import { useMeQuery } from "@/features/auth/api/authApi"
import { ResultCode } from "@/common/enum/enum"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const [isInitialized, setIsInitialized] = useState(false)

  const {data} = useMeQuery()

  useEffect(() => {
    if (data) {
      if (data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
      setIsInitialized(true)
    }
  }, [data])

  if(!isInitialized) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <CssBaseline />
        <Header />
        <Routing/>
        <ErrorSnackbar/>
      </div>
    </ThemeProvider>
  )
}
