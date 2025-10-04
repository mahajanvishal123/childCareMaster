 import { configureStore } from '@reduxjs/toolkit'
 import childReducer from './slices/childSlice.js'
 import userReducer from './slices/userSlice.js';
 import dcReducer from './slices/dcSlice.js';
 import courseReducer from './slices/courseSlice.js'
 import classroomReducer from './slices/classroomSlice.js'
 import documentReducer from './slices/documentSlice.js'
 import authReducer from './slices/authSlice.js'
 export const store = configureStore({
    reducer: {
        child : childReducer,
        user: userReducer,
        dc: dcReducer,
        courses : courseReducer,
        classroom : classroomReducer,
        document: documentReducer,
        auth: authReducer, 
    },
 })