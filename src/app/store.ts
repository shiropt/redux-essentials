import { configureStore } from '@reduxjs/toolkit'
import { postsReducer as posts } from '../features/posts/postsSlice'
import { usersReducer as users } from '../features/users/usersSlice'
import { notificationsReducer as notifications } from '../features/notifications/notificationsSlice'

export const store = configureStore({
  reducer: {
    posts,
    users,
    notifications,
  },
})
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
