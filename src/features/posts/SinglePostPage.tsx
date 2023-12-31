import React, { FC } from 'react'
import { useAppSelector } from '../../app/hooks'
import { Link, RouteComponentProps } from 'react-router-dom'
import { PostAuthor } from '../users/PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectPostById } from './postsSlice'

type Props = {
  match: RouteComponentProps<{ postId: string }>['match']
}

export const SinglePostPage: FC<Props> = ({ match }) => {
  const { postId } = match.params

  const post = useAppSelector((state) => selectPostById(state, postId))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.user}></PostAuthor>
        <TimeAgo timestamp={post.date}></TimeAgo>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}
