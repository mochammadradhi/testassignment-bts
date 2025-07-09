import type { User } from "@/lib/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);
const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }) => {
    const response = await axios.post(`${API_URL}login`, credentials);
    const { token } = response.data.data;
    localStorage.setItem(
      "authState",
      JSON.stringify({
        isAuthenticated: true,
        token,
      })
    );
    return {
      data: {
        token,
      },
    };
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (customer: Omit<User, "password">) => {
    const response = await axios.post(`${API_URL}register`, customer);
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
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.token = action.payload.data.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
        // Clear any partial state on failure
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      });
  },
});

export const { logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
