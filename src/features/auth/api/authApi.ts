import { LoginResponse, MeResponse } from './authApi.types';
import { LoginArgs } from "../lib/shemas"
import { BaseResponse } from "@/common/types"
import { baseApi } from '@/app/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<BaseResponse<MeResponse>, void>({
      query: () => `/auth/me`,
    }),
    login: builder.mutation<BaseResponse<LoginResponse>, LoginArgs>({
      query: (body) => ({
        url: `/auth/login`,
        method: 'POST',
        body,
      })
    }),
    logout: builder.mutation<BaseResponse<void>, void>({
      query: () => ({
        url: `/auth/login`,
        method: 'DELETE',
      })
    }),
  })
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi;