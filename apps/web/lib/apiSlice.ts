import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/backend",
  }),
  tagTypes: ["Users", "Bookings", "Threads", "Content", "Services", "Dashboard"],
  endpoints: (builder) => ({
    getAdminProfile: builder.query<any, void>({
      query: () => "/admin/profile",
    }),
    updateAdminProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/profile",
        method: "PUT",
        body,
      }),
    }),
    updateAdminPreferences: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/preferences",
        method: "PUT",
        body,
      }),
    }),
    changePassword: builder.mutation<any, { oldPassword: string; newPassword: string }>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    getDashboard: builder.query<any, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
    }),
    getUsers: builder.query<{ users: any[] }, void>({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    getBookings: builder.query<{ bookings: any[] }, void>({
      query: () => "/admin/bookings",
      providesTags: ["Bookings"],
    }),
    getServices: builder.query<{ items: any[] }, void>({
      query: () => "/bookings/services",
      providesTags: ["Services"],
    }),
    getThreads: builder.query<{ threads: any[] }, void>({
      query: () => "/admin/messages/threads",
      providesTags: ["Threads"],
    }),
    getMessages: builder.query<{ messages: any[] }, number>({
      query: (userId) => `/admin/messages/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Threads", id: userId } as any],
    }),
    sendMessage: builder.mutation<{ message: any }, { userId: number; content: string }>({
      query: ({ userId, content }) => ({
        url: `/admin/messages/${userId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Threads"],
    }),
    createService: builder.mutation<any, any>({
      query: (body) => ({
        url: "/bookings/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services", "Bookings"],
    }),
    createAvailability: builder.mutation<any, any>({
      query: (body) => ({
        url: "/bookings/availability",
        method: "POST",
        body,
      }),
    }),
    createContent: builder.mutation<any, any>({
      query: (body) => ({
        url: "/content",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Content"],
    }),
    getUserOnboarding: builder.query<any, number>({
      query: (userId) => `/admin/users/${userId}/onboarding`,
    }),
    updateProgramTier: builder.mutation<any, { athleteId: number; programTier: string }>({
      query: (body) => ({
        url: "/admin/users/program-tier",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    assignProgram: builder.mutation<any, { athleteId: number; programType: string }>({
      query: (body) => ({
        url: "/admin/enrollments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUpdateAdminPreferencesMutation,
  useChangePasswordMutation,
  useGetDashboardQuery,
  useGetUsersQuery,
  useGetBookingsQuery,
  useGetServicesQuery,
  useGetThreadsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateServiceMutation,
  useCreateAvailabilityMutation,
  useCreateContentMutation,
  useGetUserOnboardingQuery,
  useUpdateProgramTierMutation,
  useAssignProgramMutation,
} = apiSlice;
