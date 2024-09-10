import {createSlice, PayloadAction} from "@reduxjs/toolkit"

// AuthState 타입 정의
interface AuthState {
  isAuthenticated: boolean
  token: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<string>) => {
      state.isAuthenticated = true
      state.token = action.payload
    },
    logout: (state: AuthState) => {
      state.isAuthenticated = false
      state.token = null
    },
  },
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer
