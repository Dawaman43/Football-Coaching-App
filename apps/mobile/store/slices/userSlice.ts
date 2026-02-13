import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  id: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  profile: UserProfile;
  isLoading: boolean;
  onboardingCompleted: boolean | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  profile: {
    id: null,
    name: null,
    email: null,
    avatar: null,
  },
  isLoading: false,
  onboardingCompleted: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; profile: UserProfile }>,
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean | null>) => {
      state.onboardingCompleted = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.profile = initialState.profile;
      state.onboardingCompleted = null;
    },
  },
});

export const { setCredentials, updateProfile, setOnboardingCompleted, setLoading, logout } =
  userSlice.actions;

export default userSlice.reducer;
