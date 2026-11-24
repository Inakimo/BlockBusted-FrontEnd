import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const URL_BASE = 'http://localhost:4002'

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { getState }) => {
  const { auth } = getState()
  const token = auth.token
  if (!token) return { token: null, usuario: null }

  const response = await fetch(`${URL_BASE}/api/usuarios/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) return { token: null, usuario: null }

  const usuario = await response.json()
  return { token, usuario }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    usuario: null,
    sesionLista: false,
  },
  reducers: {
    login(state, action) {
      const { token, usuario } = action.payload
      state.token = token
      state.usuario = usuario
    },
    logout(state) {
      state.token = null
      state.usuario = null
    },
    updateUsuario(state, action) {
      state.usuario = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      state.token = action.payload.token
      state.usuario = action.payload.usuario
      state.sesionLista = true
    })
    builder.addCase(restoreSession.rejected, (state) => {
      state.sesionLista = true
    })
  },
})

export const { login, logout, updateUsuario } = authSlice.actions
export default authSlice.reducer
