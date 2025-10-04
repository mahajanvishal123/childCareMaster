import { buildCreateSlice, createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/config";
import axiosInstance from "../../utils/axiosInstance";

export const getChildren = createAsyncThunk("children/getchildren", async( _, thunkAPI) => {
    try {
        const response = await axiosInstance.get( `${BASE_URL}/children`)
         console.log(response.data)
         return response.data;

    } catch (error) {
         return error.message;
    }
})


export const deleteChild  = createAsyncThunk("chidren/deleteChildren", async( id, thunkAPI) => {
    try{
        const response = await axiosInstance.delete(`${BASE_URL}/children/${id}`)
        return response.data;
    }catch(error) {
            const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete child";
    return thunkAPI.rejectWithValue(message);
    }
})

const childSlice = createSlice({
    name : "child",
    initialState : {
        child : [],
        loading: false ,
        error: null
    },
    reducers : {},
    
    extraReducers: (builder) => {
        builder

        .addCase(getChildren.pending, (state) => {
            state.loading = true ;
            state.error = null;
        })

        .addCase(getChildren.fulfilled, (state ,action ) => {
            state.loading = false;
            state.child = action.payload;
        })
        .addCase(getChildren.rejected, (state, action) => {
            state.loading =false;
            state.error = action.payload;
        })
        .addCase(deleteChild.pending, (state) => {
            state.loading = true;
        }
        )

        .addCase(deleteChild.fulfilled, (state,action ) => {
            state.loading = false;
            state.child = action.payload;
        })
        .addCase(deleteChild.rejected, (state,action) => {
            state.loading = false;
             state.error = action.payload;
        })
    }
})

export default childSlice.reducer;