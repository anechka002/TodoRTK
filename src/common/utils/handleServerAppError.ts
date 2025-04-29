import { setAppError, setAppStatus } from "@/app/app-slice"
import { Dispatch } from "@reduxjs/toolkit"
import { BaseResponse } from "../types"

// data: BaseResponse<{item: Todolist}>
// data: BaseResponse<{item: DomainTask}>

export const handleServerAppError = <T>(dispatch: Dispatch, data: BaseResponse<T>) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }))
  } else {
    dispatch(setAppError({ error: "Some error occurred" }))
  }
  dispatch(setAppStatus({ status: "failed" }))
}
