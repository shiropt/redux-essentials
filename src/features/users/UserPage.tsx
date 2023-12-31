import { FC } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { selectAllPosts } from '../posts/postsSlice'
import { useAppSelector } from '../../app/hooks'

type Props = {
  match: RouteComponentProps<{ userId: string }>['match']
}

export const UserPage: FC<Props> = ({ match }) => {
  const { userId } = match.params

  const user = useAppSelector((state) => selectUserById(state, userId))

  const postsForUser = useAppSelector((state) => {
    const allPosts = selectAllPosts(state)
    return allPosts.filter((post) => post.user === userId)
  })

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user && user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
