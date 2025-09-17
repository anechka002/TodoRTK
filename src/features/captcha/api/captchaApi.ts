import { baseApi } from "@/app/baseApi";
import { Captcha } from "./captchaApi.types";

export const captchaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaptcha: builder.query<Captcha, void>({
      query: () => `/security/get-captcha-url`,
    }),
  })
})

export const { useLazyGetCaptchaQuery } = captchaApi;