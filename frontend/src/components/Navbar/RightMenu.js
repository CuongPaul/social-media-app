import React, { Fragment, useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { UIContext, UserContext, ChatContext } from '../../App'

import {
  Chip,
  Avatar,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import useStyles from './styles'

import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProfileMenu from './ProfileMenu'
import CreatePostMenu from './CreatePostMenu'
import AvartarText from '../UI/AvartarText'
import NotificationMenu from '../NotificationMenu'
function RightMenu() {
  const classes = useStyles()
  const { uiState } = useContext(UIContext)
  const { userState } = useContext(UserContext)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only('xs'))
  const { chatState } = useContext(ChatContext)
  const abc = new Set(chatState.messages.reduce((acc, cur) => [...acc, cur.sender.id], []));
  const abcLength = [...abc].length;
  const [amountMess, setUserMess] = useState(abcLength);
  const defaultPropsNotif = {
    color: 'error',
    children: <FontAwesomeIcon icon={faBell} size={xsScreen ? 'xs' : 'sm'} />,
  }
  const defaultPropsMess = {
    color: 'error',
    children: <FontAwesomeIcon icon={faFacebookMessenger} size={xsScreen ? 'xs' : 'sm'} />,
  }
  useEffect(() => {
    if (userState.currentUser.id === chatState.messages[0]?.receiver?.id) {
      setUserMess(abcLength);
    }
  }, [abcLength])

  return (
    <Fragment>
      {uiState.mdScreen && (
        <Chip
          component={NavLink}
          activeStyle={{ backgroundColor: 'teal',color:'#fff' }}
          to={`/profile/${userState.currentUser.id}`}
          label={
            <h3>
              {userState.currentUser.name.split(' ')[0].slice(0, 5) + '..'}
            </h3>
          }
          className={classes.profile_chip}
          avatar={
            userState.currentUser.profile_pic ? (
              <Avatar alt="Natacha" src={userState.currentUser.profile_pic} />
            ) : (
              <AvartarText
                text={userState.currentUser.name}
                bg={userState.currentUser.active ? 'seagreen' : 'tomato'}
              />
            )
          }
        />
      )}

      <CreatePostMenu />
      <IconButton
        component={NavLink}
        activeStyle={{ color: 'rgb(1,133,243)' }}
        to="/messenger"
        style={{
          marginLeft: xsScreen ? '4px' : '8px',
          color: !uiState.darkMode ? 'black' : null,
          backgroundColor: !uiState.darkMode ? '#F0F2F5' : null,
        }}
      >
        <Badge
          max={9}
          badgeContent={amountMess}
          {...defaultPropsMess}
        />
      </IconButton>
      <NotificationMenu>
        <Badge
          max={5}
          badgeContent={uiState.notifications.length}
          {...defaultPropsNotif}
        />
      </NotificationMenu>

      <ProfileMenu />
    </Fragment>
  )
}

export default RightMenu
