import "./App.css"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Header } from "@/common/components"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { selectThemeMode } from "./app-slice"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar"
import { Routing } from "@/common/routing"
import { useEffect, useState } from "react"
import { initialize } from "@/features/auth/model/auth-slice"
import CircularProgress from "@mui/material/CircularProgress"
import s from "./App.module.css"

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)

  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initialize())
      .unwrap()
      .then((res) => {
        setIsInitialized(true)
      })
      .catch((err) => {
        setIsInitialized(true)
      })
  }, [])

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
