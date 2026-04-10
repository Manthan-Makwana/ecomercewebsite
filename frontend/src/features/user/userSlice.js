import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = "http://localhost:8000/api/v1";

// ─── LOAD USER (restore session from cookie) ───────────────────────────────
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/profile`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── REGISTER ──────────────────────────────────────────────────────────────
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── LOGIN ─────────────────────────────────────────────────────────────────
export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── LOGOUT ────────────────────────────────────────────────────────────────
export const logoutAsync = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await fetch(`${BASE}/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── UPDATE PROFILE ────────────────────────────────────────────────────────
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── UPDATE PASSWORD ───────────────────────────────────────────────────────
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/password/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── INITIAL STATE ─────────────────────────────────────────────────────────
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authChecked: false, // true once auth has been verified at least once
};

// ─── SLICE ─────────────────────────────────────────────────────────────────
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOAD USER
      .addCase(loadUser.pending, (state) => { state.loading = true; })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })

      // REGISTER
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authChecked = true;
      })

      // LOGIN
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authChecked = true;
      })

      // LOGOUT
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.loading = false;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PASSWORD
      .addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearError } = userSlice.actions;
export default userSlice.reducer;