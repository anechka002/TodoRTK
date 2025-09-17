import { selectThemeMode, setIsLoggedIn } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import s from "./Login.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginArgs, loginSchema } from "../../lib/shemas"
import { useLoginMutation } from "../../api/authApi"
import { ResultCode } from "@/common/enum/enum"
import { AUTH_TOKEN } from "@/common/constants.ts"
import { CaptchaForm } from "@/features/captcha/ui/CaptchaForm"
import { useLazyGetCaptchaQuery } from "@/features/captcha/api/captchaApi"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const [login] = useLoginMutation()

  const [triggerCaptcha, { data: captchaData, isFetching: isCaptchaLoading }] = useLazyGetCaptchaQuery()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginArgs>({
    defaultValues: { email: "", password: "", rememberMe: false, captcha: "" },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginArgs> = async (data) => {
    const res = await login(data)

    if (res.data?.resultCode === ResultCode.CaptchaError) {
      triggerCaptcha()
      return
    }

    if (res.data?.resultCode === ResultCode.Success) {
      localStorage.setItem(AUTH_TOKEN, res.data.data.token)
      dispatch(setIsLoggedIn({ isLoggedIn: true }))
    }
    reset()
  }

  return (
    <Grid container justifyContent={"center"}>
      <FormControl>
        <FormLabel>
          <p>
            To login get registered
            <a
              style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
              href="https://social-network.samuraijs.com"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>
            <b>Email:</b> free@samuraijs.com
          </p>
          <p>
            <b>Password:</b> free
          </p>
        </FormLabel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <TextField label="Email" margin="normal" error={!!errors.email} {...field} />}
            />
            {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  type="password"
                  label="Password"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message} // ошибку передаем в helper text
                  {...field}
                />
              )}
            />
            {/* {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>} */}

            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} />}
                />
              }
            />

            {captchaData?.url && (
              <CaptchaForm
                url={captchaData?.url ?? null}
                onRefresh={() => triggerCaptcha()}
                register={register}
                isCaptchaLoading={isCaptchaLoading}
                reset={reset}
              />
            )}

            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}
