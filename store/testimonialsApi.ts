import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Testimonial } from "@/hooks/fetchTestimonials";
import { baseUrl } from "@/hooks/fetchData";

export const testimonialsApi = createApi({
  reducerPath: "testimonialsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getTestimonials: builder.query<Testimonial[], void>({
      query: () => "testimonials/",
    }),
  }),
});

export const { useGetTestimonialsQuery } = testimonialsApi;
