import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/config";

export const getAllCourses = createAsyncThunk("courses/getcourses", async ( _ , thunkAPI ) => {
    try{

        
        const response = await axiosInstance.get(`${BASE_URL}/courses`);
        console.log(response.data)
        return response.data;

    }catch(error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})


export const addCourse = createAsyncThunk("courses/addcourse", async (formData, thunkAPI) => {
 console.log("Course Payload " , formData);
    try {
        const response = await axiosInstance.post(`${BASE_URL}/courses`, formData,
            {
                 headers: {
        "Content-Type": "multipart/form-data",
      }
    });
        
        return response.data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.message);

    }
})


export const deleteCourse = createAsyncThunk("courses/deletecourse", async (courseId, thunkAPI) =>  {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/courses/${courseId}`);
            return response.data;
        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    })

   export const updateCourse = createAsyncThunk(
  "courses/updatecourse",
  async ({ course_id, formData }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/courses/${course_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



const initialState   =  {
    courses: [],
    courseloading: false,
    courseerror: null,
}


const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
        .addCase(getAllCourses.pending, (state, action) => {
            state.courseloading = true;
            state.courseerror = null;
            })

        .addCase(getAllCourses.fulfilled, (state,action ) => {
                state.courseloading = false;
                state.courses = action.payload.data;
            })
        .addCase(getAllCourses.rejected, (state, action) => {
                state.courseloading = false;
                state.courseerror = action.payload;
                })

        .addCase(addCourse.pending, (state) => {
                    state.courseloading = true;
                    state.courseerror = null;
                    })
        .addCase(addCourse.fulfilled, (state, action) => {
                      state.courseloading = false;
                     state.courses.push(action.payload.data);
              })
        .addCase(addCourse.rejected, (state, action) => {
                 state.courseloading = false;
                 state.courseerror = action.payload;
             })

            .addCase(deleteCourse.pending, (state) => {
                state.courseloading = true;
                state.courseerror = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.courseloading = false;
                state.courses = state.courses.filter((course) => course.id !== action.payload.data.id)
                })

            .addCase(updateCourse.pending, (state) => {
  state.courseloading = true;
  state.courseerror = null;
})
.addCase(updateCourse.fulfilled, (state, action) => {
  state.courseloading = false;
  const updated = action.payload.data;
  const index = state.courses.findIndex(course => course.course_id === updated.course_id);
  if (index !== -1) {
    state.courses[index] = updated;
  }
})
.addCase(updateCourse.rejected, (state, action) => {
  state.courseloading = false;
  state.courseerror = action.payload;
});


    }
})

export default courseSlice.reducer;