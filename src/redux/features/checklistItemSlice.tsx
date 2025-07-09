import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";

export interface ChecklistItem {
  id: number;
  name: string;
  checklistId: number;
  itemCompletionStatus: boolean;
}

interface ChecklistItemState {
  [checklistId: number]: ChecklistItem[];
}

const initialState: ChecklistItemState = {};

export const fetchChecklistItems = createAsyncThunk(
  "checklistItems/fetch",
  async (checklistId: number) => {
    const res = await api.get(`/checklist/${checklistId}/item`);
    return { checklistId, items: res.data.data };
  }
);

export const addChecklistItem = createAsyncThunk(
  "checklistItems/add",
  async ({ checklistId, name }: { checklistId: number; name: string }) => {
    const res = await api.post(`/checklist/${checklistId}/item`, {
      itemName: name,
    });
    return { checklistId, item: res.data.data };
  }
);

export const toggleChecklistItem = createAsyncThunk(
  "checklistItems/toggle",
  async ({ checklistId, id }: { checklistId: number; id: number }) => {
    const res = await api.put(`/checklist/${checklistId}/item/${id}`);
    return { checklistId, item: res.data.data };
  }
);

export const renameChecklistItem = createAsyncThunk(
  "checklistItems/rename",
  async ({
    checklistId,
    id,
    newName,
  }: {
    checklistId: number;
    id: number;
    newName: string;
  }) => {
    const res = await api.put(`/checklist/${checklistId}/item/rename/${id}`, {
      itemName: newName,
    });
    return { checklistId, item: res.data.data };
  }
);

export const deleteChecklistItem = createAsyncThunk(
  "checklistItems/delete",
  async ({ checklistId, id }: { checklistId: number; id: number }) => {
    await api.delete(`/checklist/${checklistId}/item/${id}`);
    return { checklistId, id };
  }
);

const checklistItemSlice = createSlice({
  name: "checklistItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklistItems.fulfilled, (state, action) => {
        state[action.payload.checklistId] = action.payload.items;
      })
      .addCase(addChecklistItem.fulfilled, (state, action) => {
        state[action.payload.checklistId].push(action.payload.item);
      })
      .addCase(renameChecklistItem.fulfilled, (state, action) => {
        const items = state[action.payload.checklistId];
        const index = items.findIndex((i) => i.id === action.payload.item.id);
        if (index !== -1) items[index] = action.payload.item;
      })
      .addCase(toggleChecklistItem.fulfilled, (state, action) => {
        const items = state[action.payload.checklistId];
        const index = items.findIndex((i) => i.id === action.payload.item.id);
        if (index !== -1) items[index] = action.payload.item;
      })
      .addCase(deleteChecklistItem.fulfilled, (state, action) => {
        state[action.payload.checklistId] = state[
          action.payload.checklistId
        ].filter((i) => i.id !== action.payload.id);
      });
  },
});

export default checklistItemSlice.reducer;
