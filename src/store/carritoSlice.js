import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { logout } from './authSlice'

const URL_BASE = 'http://localhost:4002'

export const fetchCantidadCarrito = createAsyncThunk('carrito/fetchCantidad', async (_, { getState }) => {
  const { auth } = getState()
  if (!auth.token || !auth.usuario || auth.usuario.role !== 'COMPRADOR') return 0

  const response = await fetch(`${URL_BASE}/api/carrito`, {
    headers: { Authorization: `Bearer ${auth.token}` },
  })

  if (!response.ok) return 0

  const data = await response.json()
  const items = data?.items ?? []
  return items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0)
})

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    cantidad: 0,
  },
  reducers: {
    setCantidad(state, action) {
      state.cantidad = action.payload
    },
    incrementarCantidad(state, action) {
      state.cantidad += action.payload ?? 1
    },
    decrementarCantidad(state, action) {
      state.cantidad = Math.max(0, state.cantidad - (action.payload ?? 1))
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCantidadCarrito.fulfilled, (state, action) => {
      state.cantidad = action.payload
    })
    builder.addCase(logout, (state) => {
      state.cantidad = 0
    })
  },
})

export const { setCantidad, incrementarCantidad, decrementarCantidad } = carritoSlice.actions
export default carritoSlice.reducer
