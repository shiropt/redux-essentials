import { useLayoutEffect } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { selectAllUsers } from '../users/usersSlice'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  selectAllNotifications,
  allNotificationsRead,
} from './notificationsSlice'
import classNames from 'classnames'
export const NotificationsList = () => {
  const dispatch = useAppDispatch()

  const notifications = useAppSelector(selectAllNotifications)
  const users = useAppSelector(selectAllUsers)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }
    const notificationClassname = classNames('notification', {
      new: notification.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
