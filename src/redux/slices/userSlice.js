import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/config";


export const addUser = createAsyncThunk("user/addUser", async (userform, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/users/register`, userform);
    return response.data;
  } catch (error) {
          const message = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to register user";
    return thunkAPI.rejectWithValue(message);
  }
  
});

export const getUsers = createAsyncThunk( "users/getusers", async( _, thunkAPI) => {
    try{
        const response = await axiosInstance.get(`${BASE_URL}/users/`);
         console.log("response " ,response);
         return response.data;
    }catch( error) {
           const message =
      error?.response?.data?.message || "Failed to register user";
    return thunkAPI.rejectWithValue(message); 
    }
})

export const updateUser  = createAsyncThunk("users/updateuser", async(user) => {
     const { user_id, ...payload } = user;
     try {

         const response = await axiosInstance.patch(`${BASE_URL}/users/${user_id}`,payload);
         console.log(response.data)
         return response.data;
     } catch (error) {
         const message =
      error?.response?.data?.message || "Failed to register user";
    return thunkAPI.rejectWithValue(message); 
     }
}
)

export const deleteUser = createAsyncThunk("user/deleteuser" , async( id,thunkAPI) => {
    const user_id = id;
    try{
        const resposne = await axiosInstance.delete(`${BASE_URL}/users/${user_id}`);
        console.log(resposne.data );
        return resposne.data;
    }catch(error){
         const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete user";
    return thunkAPI.rejectWithValue(message);
    }
})





const initialState = {
    user: [],
    loading:false,
    error: null
}


const userSlice  = createSlice( {
    name: "user",
    initialState,
    reducers: {},
     extraReducers : (builder) => {
        builder

        .addCase(addUser.pending, ( state ) => {
            state.loading = true;
        })
        .addCase(addUser.fulfilled, (state , action ) => {
            state.loading = false;
            state.user.push(action.payload.data);
        })
        .addCase(addUser.rejected, (state,action) => {
            state.loading = false;
           state.error = action.payload;
        })

        .addCase(getUsers.pending, (state) => {
            state.loading = true;
        })
         .addCase(getUsers.fulfilled, (state,action) => {
            state.loading = false;
            state.user = action.payload.data;
        })

        .addCase(getUsers.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload;
        })

        .addCase(updateUser.pending, (state) => {
            state.loading =true;
        })
        .addCase(updateUser.fulfilled, (state,action) => {
         const updatedUser = action.payload;
         const index = state.user.findIndex(u => u.user_id === updatedUser.user_id);
             if (index !== -1) {
           state.user[index] = updatedUser;
            }
         })
         .addCase(updateUser.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload.data;
         } )

         .addCase(deleteUser.pending, (state) => {
            state.loading = true ;
         })
         .addCase(deleteUser.fulfilled, (state,action ) => {
            state.loading = false;
            state.user = state.user.filter((user) => user.user_id !== action.payload.user_id)
         })
           .addCase(deleteUser.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
         } )
     }

})

export default userSlice.reducer;