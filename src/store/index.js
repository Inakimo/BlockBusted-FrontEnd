import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import carritoReducer from './carritoSlice'

// sesionLista never persisted — always starts false, restoreSession sets it true after validation
const authTransform = createTransform(
  (inbound) => ({ token: inbound.token, usuario: inbound.usuario }),
  (outbound) => ({ ...outbound, sesionLista: false }),
  { whitelist: ['auth'] }
)

export const store = configureStore({
  reducer: {
    auth: persistReducer({ key: 'auth', storage, transforms: [authTransform] }, authReducer),
    carrito: persistReducer({ key: 'carrito', storage }, carritoReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
