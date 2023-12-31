import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export type Post = {
  id: string
  date: string
  user: string
  title: string
  content: string
  reactions: Reactions
}

type Reactions = {
  thumbsUp: number
  hooray: number
  heart: number
  rocket: number
  eyes: number
}

const reactions = {
  thumbsUp: 0,
  hooray: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

type PostsState = {
  posts: Post[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | undefined | null
}
const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
}
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost: Pick<Post, 'title' | 'content' | 'user'>) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: keyof Reactions }>
    ) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload)
      },
      prepare(title: string, content: string, user: string) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user,
            reactions,
          },
        }
      },
    },
    postUpdated: {
      reducer(state, action: PayloadAction<Post>) {
        const { id, title, content } = action.payload
        const existingPost = state.posts.find((post) => post.id === id)
        if (existingPost) {
          existingPost.title = title
          existingPost.content = content
        }
      },
      prepare(id: string, title: string, content: string, user: string) {
        return {
          payload: {
            id,
            user,
            title,
            content,
            date: new Date().toISOString(),
            reactions,
          },
        }
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // We can directly add the new post object to our posts array
        state.posts.push(action.payload)
      })
  },
})
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export const postsReducer = postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts.posts

export const selectPostById = (state: RootState, postId: Post['id']) =>
  state.posts.posts.find((post) => post.id === postId)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)
