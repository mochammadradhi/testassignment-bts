import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

interface Checklist {
  id: number;
  name: string;
}

interface ChecklistState {
  data: Checklist[];
  loading: boolean;
  error: string | null;
}

const initialState: ChecklistState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchChecklists = createAsyncThunk(
  "checklist/fetchAll",
  async () => {
    const response = await api.get("/checklist");
    return response.data.data;
  }
);

export const addChecklist = createAsyncThunk(
  "checklist/add",
  async (name: string) => {
    const response = await api.post("/checklist", { name });
    return response.data.data;
  }
);

export const deleteChecklist = createAsyncThunk(
  "checklist/delete",
  async (id: number) => {
    await api.delete(`/checklist/${id}`);
    return id;
  }
);

const checklistSlice = createSlice({
  name: "checklist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChecklists.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch";
      })
      .addCase(addChecklist.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(deleteChecklist.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      });
  },
});

export default checklistSlice.reducer;
