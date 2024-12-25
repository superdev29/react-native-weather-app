import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { weatherApi } from '@/src/store/api/weatherApi';
import settingsReducer from '@/src/store/slices/settingsSlice';
import { initializeStorage } from '../utils/storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings'], // Only persist settings
  timeout: 10000, // Increase timeout
  writeFailHandler: (err: Error) => {
    console.warn('Redux Persist write failed:', err);
  },
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  [weatherApi.reducerPath]: weatherApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(weatherApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Initialize store with error handling
export const initializeStore = async () => {
  try {
    await initializeStorage();
    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }).concat(weatherApi.middleware),
    });
    const persistor = persistStore(store);
    return { store, persistor };
  } catch (error) {
    console.error('Store initialization error:', error);
    throw error;
  }
}; 