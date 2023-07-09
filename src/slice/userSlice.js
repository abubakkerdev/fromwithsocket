import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: {},
  },
  reducers: {
    insertData: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { insertData } = userSlice.actions;
export default userSlice.reducer;
