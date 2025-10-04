import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/config";

// GET documents
export const getDocuments = createAsyncThunk("document/getDocs", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/documents`);
    return response.data; // expects { data: [...] }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// ADD document
export const addDocument = createAsyncThunk("document/addDoc", async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/documents/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // expects { data: {...} }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// DELETE document
export const deleteDocument = createAsyncThunk("document/deleteDoc", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/documents/${id}`);
    return id; // return deleted ID
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  documents: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.data; // response.data.data (list)
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload.data); // response.data.data (new doc)
      })
      .addCase(addDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((doc) => doc.id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default documentSlice.reducer;
