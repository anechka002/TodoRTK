import { Main } from "@/app/Main"
import { Login } from "@/features/auth/ui/Login/Login"
import { Route, Routes } from "react-router"
import { PageNotFound, ProtectedRoute } from "../components"
import { useAppSelector } from "../hooks"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice"

export const PATH = {
  MAIN: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  NOTFOUND: '*',
} as const

export const Routing = () => {

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      {/* Private routes */}
      {/* <Route path={PATH.MAIN} element={<ProtectedRoute isAllowed={isLoggedIn}><Main /></ProtectedRoute>} />
      <Route path={PATH.DASHBOARD} element={<ProtectedRoute isAllowed={isLoggedIn}><h2>Dashboard</h2></ProtectedRoute>} /> */}
      {/*  2 variant */}
      {/* Private routes. Если пользователь не залогинен, то он не попадает в этот роуты  */}
      <Route element={<ProtectedRoute isAllowed={isLoggedIn}/>}>
        <Route path={PATH.MAIN} element={<Main />} />
        <Route path={PATH.DASHBOARD} element={<h2>Dashboard</h2>} />
      </Route>
      {/* Private routes. Если пользователь залогинен, то он не попадает в этот роут */}
      <Route element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath={PATH.MAIN}/>}>
        <Route path={PATH.LOGIN} element={<Login />} />
      </Route>

      <Route path={PATH.NOTFOUND} element={<PageNotFound />} />
    </Routes>
  )
}
