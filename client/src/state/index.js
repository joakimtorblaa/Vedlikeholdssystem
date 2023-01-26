import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "dark",
    user: null,
    token: null,
    notifications: 0
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.fullName = action.payload.fullName;
            state.notifications = action.payload.notifications;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.fullName = null;
            state.notifications = null;
        },
        setTeam: (state, action) => {
            if (state.user) {
                state.user.team = action.payload.team;
            } else {
                console.error("No members in team");
            }
        },
        setHelmetNotifications: (state, action) => {
            console.log(action.payload);
            console.log(state.notifications);
            state.notifications = action.payload.notifications;
        }
    }
})
export const { setMode, setLogin, setLogout, setTeam, setHelmetNotifications } =
    authSlice.actions;
export default authSlice.reducer;