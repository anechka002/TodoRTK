import { setAppError, setAppStatus } from "@/app/app-slice"
import type { Dispatch } from "@reduxjs/toolkit"
import axios from "axios";
import { z } from "zod";

export const handleServerNetworkError = (dispatch: Dispatch, error: unknown) => {
  // console.table(error.issues)
  let errorMessage;
  
  if(axios.isAxiosError(error)) {
    errorMessage = error.message;
  } else if (error instanceof Error) {
    
    if (error instanceof z.ZodError) {
      console.table(error.issues);
      errorMessage = 'ZodError. Смотри консоль'
    } else {
      errorMessage = `Native error ${error.message}`;
    }

  } else {
    errorMessage = JSON.stringify(error)
  }

  dispatch(setAppError({error: errorMessage}))
  dispatch(setAppStatus({status: 'failed'}))
}