// src/redux/slices/businessSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { BASE_URL } from '../../utils/config';

export const getBusinessInfo = createAsyncThunk('business/get', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/business`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const addBusinessInfo = createAsyncThunk('business/add', async (formData, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/business`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const businessSlice = createSlice({
  name: 'business',
  initialState: {
    info: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBusinessInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(getBusinessInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addBusinessInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBusinessInfo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addBusinessInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default businessSlice.reducer;
