import { AUTH_TOKEN } from "@/common/constants.ts"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseQueryWithZodValidation, handleError } from "@/common/utils"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: baseQueryWithZodValidation(async (args, api, extraOptions) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))

    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: 'include',
      prepareHeaders: (headers) => {
        headers.set("API-KEY", import.meta.env.VITE_API_KEY)
        headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
      },
    })(args, api, extraOptions)

    handleError(api, result)
    
    return result
  }),
  endpoints: () => ({}),
  //keepUnusedDataFor: 5 // Время хранения данных в кэше по умолчанию 60 секунд,

  //refetchOnFocus: true, // для автоматического повторного запроса за данными, когда окно приложения или вкладка браузера возвращаются в фокус.

  refetchOnReconnect: true, // для автоматического повторного запроса за данными, когда приложение или браузер восстанавливает соединение с интернетом после его потери.

})