import createTheme from "@mui/material/styles/createTheme"
import { ThemeMode } from "../types"

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
