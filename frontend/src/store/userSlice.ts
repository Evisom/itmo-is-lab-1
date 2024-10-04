import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  isAdmin: boolean;
  token: string;
  id: number | null;
}

const initialState: UserState = {
  username: "",
  isAdmin: false, // Assuming this is a boolean
  token: "",
  id: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload; // Access the payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload; // Access the payload
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload; // Access the payload
    },
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
  },
});

export const { setUsername, setToken, setIsAdmin, setId } = userSlice.actions;
export default userSlice.reducer;
