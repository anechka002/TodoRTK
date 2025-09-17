import { UseFormRegister, UseFormReset } from "react-hook-form"
import { LoginArgs } from "@/features/auth/lib/shemas"
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

type Props = {
  url: string | null
  register: UseFormRegister<LoginArgs>
  onRefresh: () => void
  isCaptchaLoading: boolean
  reset: UseFormReset<LoginArgs>
}

export const CaptchaForm = ({url, register, onRefresh, isCaptchaLoading, reset}: Props) => {

  const onRefreshHandler = () => {
    reset({ captcha: "" })
    onRefresh()
  }

  return (
    <div>
      <h2>Введите капчу</h2>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>

        {isCaptchaLoading ? (
          <CircularProgress />
        ) : (
          <>
          {url && <img src={url} alt="Captcha" />}
          </>
        )}
        
        <TextField
          {...register("captcha", { required: "Введите символы с картинки" })}
          placeholder="Введите символы с картинки"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        
        <Button onClick={onRefreshHandler} disabled={isCaptchaLoading}>
          {isCaptchaLoading ? 'Обновляем...' : 'Обновить капчу'}
        </Button>
      </Box>    
    </div>
  )
}
