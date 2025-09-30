import { configureStore } from '@reduxjs/toolkit';
import { nycDataApi } from '../services/nycDataApi';

export const store = configureStore({
  reducer: {
    [nycDataApi.reducerPath]: nycDataApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(nycDataApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
