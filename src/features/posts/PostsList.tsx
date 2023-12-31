import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { PostAuthor } from '../users/PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectAllPosts, fetchPosts, Post } from './postsSlice'
import { FC, useEffect } from 'react'
import { Spinner } from '../../components/Spinner'

const PostExcerpt: FC<{ post: Post }> = ({ post }) => {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const postsStatus = useAppSelector((state) => state.posts.status)
  const error = useAppSelector((state) => state.posts.error)
  const posts = useAppSelector(selectAllPosts)

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postsStatus, dispatch])
  let content

  if (postsStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postsStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postsStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
