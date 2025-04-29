import { ThemeMode } from "@/app/app-slice"
import createTheme from "@mui/material/styles/createTheme"

export const getTheme = (themeMode: ThemeMode) => {
  const theme = createTheme({
    palette: {
      mode: themeMode,
      secondary: {
        main: "#3a9ac6",
      },
    },
  })
  return theme
}
