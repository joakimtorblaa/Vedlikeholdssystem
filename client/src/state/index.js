import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "dark",
    user: null,
    token: null,
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
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.fullName = null;
        },
        setTeam: (state, action) => {
            if (state.user) {
                state.user.team = action.payload.team;
            } else {
                console.error("No members in team");
            }
        }
    }
})

export const { setMode, setLogin, setLogout, setTeam, setLocations } =
    authSlice.actions;
export default authSlice.reducer;