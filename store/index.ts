import { configureStore } from "@reduxjs/toolkit";
import { myInfoApi } from "./myInfoApi";
import { testimonialsApi } from "./testimonialsApi";

export const store = configureStore({
  reducer: {
    [myInfoApi.reducerPath]: myInfoApi.reducer,
    [testimonialsApi.reducerPath]: testimonialsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(myInfoApi.middleware)
      .concat(testimonialsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
