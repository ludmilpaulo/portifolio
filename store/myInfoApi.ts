import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MyInfoResponse } from "@/hooks/types";
import { baseUrl } from "@/hooks/fetchData";

export const myInfoApi = createApi({
  reducerPath: "myInfoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 300,
  endpoints: (builder) => ({
    getMyInfo: builder.query<MyInfoResponse, void>({
      query: () => "my_info/",
    }),
  }),
});

export const { useGetMyInfoQuery } = myInfoApi;
