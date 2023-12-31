import { FC } from 'react'
import { useAppSelector } from '../../app/hooks'

type Props = {
  userId: string
}

export const PostAuthor: FC<Props> = ({ userId }) => {
  const author = useAppSelector((state) =>
    state.users.find((user) => user.id === userId)
  )

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
