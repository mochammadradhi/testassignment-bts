import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import type { User } from "@/lib/types";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }) => {
    const response = await api.post("/login", credentials);
    const { token } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem(
      "authState",
      JSON.stringify({ token, isAuthenticated: true })
    );

    return { data: { token } };
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (customer: User) => {
    const response = await api.post("/register", customer);
    return response.data.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    hydrate: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      });
  },
});

export const { logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
