import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { RootState } from '../../app/store'

type Notification = {
  id: string
  date: string
  message: string
  user: string
  isNew: boolean
  read: boolean
}

export const fetchNotifications = createAsyncThunk<
  Notification[],
  undefined,
  { state: RootState }
>('notifications/fetchNotifications', async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get(
    `/fakeApi/notifications?since=${latestTimestamp}`
  )
  return response.data
})

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [] as Notification[],
  reducers: {
    allNotificationsRead(state) {
      console.log('allNotificationsRead')

      state.forEach((notification) => {
        notification.read = true
      })
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      state.forEach((notification) => {
        notification.isNew = !notification.read
      })
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export const notificationsReducer = notificationsSlice.reducer
export const selectAllNotifications = (state: RootState) => state.notifications
