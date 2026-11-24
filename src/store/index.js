import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import carritoReducer from './carritoSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carrito: carritoReducer,
  },
})
