import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/config";

export const getClassroom = createAsyncThunk( "classroom/get" , async ( _ , thunkAPI ) => {
   try{
     const response = await axiosInstance( `${BASE_URL}/classrooms` );
     console.log("Classs", response.data)
     return  response.data;
   }catch(error) {
    return thunkAPI.rejectWithValue( error.message );
   }}
)

export const addClassRoom = createAsyncThunk( "classroom/addClass" , async ( formData , thunkAPI) => {
    try{
        const response = await axiosInstance.post(`${BASE_URL}/classrooms`, formData);
        return response.data;
        }catch(error) {
            return thunkAPI.rejectWithValue(error.message);
            }
        }) 

export const deleteClassroom = createAsyncThunk("classroom/deleteclass", async( id, thunkAPI) => {
    try{
        const response = await axiosInstance.delete(`${BASE_URL}/classrooms/${id}`);
        return response.data;
        }catch(error) {
            return thunkAPI.rejectWithValue(error.message);
            }
})



const initialState = {
    classroom: [],
    error: null,
    loading: false,
}
const classroomSlice = createSlice({
    name: "classroom",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getClassroom.pending, (state) => {
            state.loading = true;
            state.error = null;
            })

             .addCase(getClassroom.fulfilled, (state,action) => {
            state.loading = true;
           state.classroom = action.payload.data;

            })

            .addCase(getClassroom.rejected, ( state,action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(addClassRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
                })
                .addCase(addClassRoom.fulfilled, (state,action) => {
                    state.loading = false;
                  state.classroom.push(action.payload.data);
                })

                .addCase(addClassRoom.rejected, (state,action) => {
                    state.loading = false;
                    state.error = action.payload;
                    })

                    .addCase(deleteClassroom.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                    })
                    .addCase(deleteClassroom.fulfilled, (state, action) => {
                        state.loading = false;
                        state.classroom = state.classroom.filter((item) => item.id !== action.payload);
                    })

                    .addCase(deleteClassroom.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                    })

                }

})

export default classroomSlice.reducer;

