import React, { useContext } from 'react'
import { Paper, Grid, Typography, Button, Avatar } from '@material-ui/core'
import AvartarText from '../UI/AvartarText'
import { unFriend } from '../../services/UserServices';
import { UserContext } from '../../App'

function Friends({ user }) {
  const { userDispatch } = useContext(UserContext);

  return (
    <Grid container spacing={2}>
      {user.friends &&
        user.friends.map((friend) => (
          <Grid item xs={12} sm={6} md={6} key={friend.id}>
            <Paper
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {friend.profile_pic ? (
                <Avatar src={friend.profile_pic} variant="square" />
              ) : (
                <AvartarText
                  bg={friend.active ? 'seagreen' : 'tomato'}
                  text={friend.name}
                  size={70}
                />
              )}
              <Typography
                style={{ marginTop: '16px', flexGrow: 1 }}
                variant="h5"
                color="inherit"
              >
                {friend.name}
              </Typography>
              <Typography
                style={{ marginTop: '6px', flexGrow: 1 }}
                variant="h6"
                color="inherit"
              >
                {friend.email}
              </Typography>
              <Button
                variant="contained"
                style={{
                  backgroundColor: 'tomato',
                  color: '#fff',
                  marginTop: '16px',
                }}
                onClick={() => {
                  const userRequest = {id: user.id, friends: user.friends.map(item => item.id)};
                  const friendRequest = {id: friend.id, friends: friend.friends.map(item => item.id)};

                  const newPayload = user.friends.filter(item => item.id !== friend.id);

                  unFriend({userRequest, friendRequest}).then(res => {
                    userDispatch({type:"REMOVE_FRIEND", payload: newPayload})
                  })
                }}
              >
                Unfriend
              </Button>
            </Paper>
          </Grid>
        ))}
    </Grid>
  )
}

export default Friends
