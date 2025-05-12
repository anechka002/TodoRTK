import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import { useAppSelector } from "@/common/hooks/useAppSelector"
import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { changeThemeModeAC, selectIsLoggedIn, selectStatus, selectThemeMode, setIsLoggedIn } from "@/app/app-slice"
import { getTheme } from "@/common/theme/theme"
import { NavButton } from "../NavButton/NavButton"
import LinearProgress from "@mui/material/LinearProgress"
import { useLogoutMutation } from "@/features/auth/api/authApi"
import { ResultCode } from "@/common/enum/enum"
import { AUTH_TOKEN } from "@/common/constants.ts"
import { baseApi } from "@/app/baseApi"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const [logout] = useLogoutMutation()

  const changeMode = () => {
    const newMode = themeMode === "light" ? "dark" : "light"
    dispatch(changeThemeModeAC({ themeMode: newMode }))
  }

  const logoutHandler = () => {
    logout()
      .then((res) => {
        if (res.data?.resultCode === ResultCode.Success) {
          localStorage.removeItem(AUTH_TOKEN)
          dispatch(setIsLoggedIn({ isLoggedIn: false }))
        }
      })
      .then(() => {
        dispatch(baseApi.util.invalidateTags(["Todolist", "Task"]))
      })
  }

  return (
    <AppBar position="static" color="secondary" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container
          maxWidth={"xl"}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton color="inherit" aria-label="menu" edge="start" size="large">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TODO
          </Typography>
          <div>
            {isLoggedIn && <NavButton onClick={logoutHandler}>Logout</NavButton>}
            <NavButton background={theme.palette.secondary.dark}>Faq</NavButton>
            <Switch color="secondary" onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {( status === "loading" ) && <LinearProgress />}
    </AppBar>
  )
}