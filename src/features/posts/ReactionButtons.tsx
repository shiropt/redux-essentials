import { FC } from 'react'
import { Post } from './postsSlice'
import { reactionAdded } from './postsSlice'
import { useAppDispatch } from '../../app/hooks'

type Props = { post: Post }
const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
} as const

type Name = keyof typeof reactionEmoji
type Emoji = (typeof reactionEmoji)[Name]

export const ReactionButtons: FC<Props> = ({ post }: any) => {
  const dispatch = useAppDispatch()

  const reactionButtons = Object.entries<Emoji>(reactionEmoji).map(
    ([name, emoji]) => {
      return (
        <button
          key={name}
          type="button"
          className="muted-button reaction-button"
          onClick={() =>
            dispatch(reactionAdded({ postId: post.id, reaction: name as Name }))
          }
        >
          {emoji} {post.reactions && post.reactions[name]}
        </button>
      )
    }
  )

  return <div>{reactionButtons}</div>
}
