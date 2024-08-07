import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action) {
            console.log('Adding notification:', action.payload);
            const existingNotification = state.notifications.find(notification => notification._id === action.payload._id);
            if (!existingNotification) {
                state.notifications.push(action.payload);
            }
        },
        
        removeNotification(state, action) {
            state.notifications = state.notifications.filter(notification => notification._id !== action.payload);
        }
    }
});

export const { addNotification, removeNotification } = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
