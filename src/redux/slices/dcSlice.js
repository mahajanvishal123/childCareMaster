import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/config";

export const fetchDCs = createAsyncThunk( "dc/fetchDC", async ( _, thhunkAPI) => {
    try {
         const response = await axiosInstance.get(`${BASE_URL}/dc`);
         console.log("DC REsposne " , response.data);
         return response.data ;
    } catch (error) {
       console.log(error)
        return error.message;
    }
}
)


export const addDC = createAsyncThunk("dc/addDC", async(payload, thunkAPI) => {
    try {
         const response = await axiosInstance.post(`${BASE_URL}/dc`,payload)
         return response.data;
    } catch (error) {
        console.log(error)
        return error.message;
    }
})

export const deleteDC = createAsyncThunk("dc/deleteDC", async( id ) => 
{
    try {
        const response = await axiosInstance.delete( `${BASE_URL}/dc/${id}`);
      console.log(response.data)
        return response.data;
         
    } catch (error) {
        console.log(error.message)
        return error.message;
    }
})



const initialState = {
    dc: [],
    dcloading : false,
    dcerror: null
}


const dcSlice = createSlice({
    name : "dc",
    initialState,
    reducer: {},

    extraReducers : (builder) => {
        builder
        
        .addCase ( fetchDCs.pending, (state ) => {
            state.dcloading = true;
        })
        .addCase( fetchDCs.fulfilled, (state,action ) => {
              state.dcloading  = false;
              state.dc = action.payload.data;
        })
        .addCase( fetchDCs.rejected, (state,action ) => {
              state.dcloading  = false;
              state.error = action.payload;
        })
        .addCase( addDC.pending, (state) => {
            state.dcloading = true;

        })
        .addCase(addDC.fulfilled, (state, action) => {
            state.dcloading = false;
            state.dc.push(action.payload.data);
        })
         .addCase( addDC.rejected, (state,action ) => {
              state.dcloading  = false;
              state.error = action.payload;
        })
        .addCase(deleteDC.pending, (state) => {
            state.dcloading =true;

        })
           .addCase(deleteDC.fulfilled, (state, action) => {
  state.dcloading = false;
  state.dc = state.dc.filter(dc => dc.id !== action.payload.data.id);
})
    }

})

export default dcSlice.reducer;