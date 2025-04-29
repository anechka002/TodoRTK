import { LoginResponse, MeResponse } from './authApi.types';
import { instance } from "@/common/instance"
import { Inputs } from "../lib/shemas"
import { BaseResponse } from "@/common/types"

export const authApi = {
  login(payload: Inputs) {
    return instance.post<BaseResponse<LoginResponse>>(`/auth/login`, payload)
  },
  logout() {
    return instance.delete<BaseResponse>(`/auth/login`)
  },
  me() {
    return instance.get<BaseResponse<MeResponse>>(`/auth/me`)}
}