import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'
export type User = {
  id: string
  name: string
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const initialState: User[] = []

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export const usersReducer = usersSlice.reducer

export const selectAllUsers = (state: RootState) => state.users

export const selectUserById = (state: RootState, userId: string) =>
  state.users.find((user) => user.id === userId)
