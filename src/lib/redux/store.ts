import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add RTK Query API reducer
      [baseApi.reducerPath]: baseApi.reducer,
      // Add other reducers here as needed
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Infer types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
