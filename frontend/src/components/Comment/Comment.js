import {
  Avatar,
  Button,
  Divider,
  CardMedia,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { MoreHoriz, SendOutlined } from '@material-ui/icons'
import AvartarText from '../UI/AvartarText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp as filledLike } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { likeDislikeComment, editComment } from '../../services/PostServices'
import { PostContext, UserContext, UIContext } from '../../App'
function Comment({ comment }) {
  const { postDispatch } = useContext(PostContext)
  const { userState } = useContext(UserContext)
  const { uiDispatch, uiState } = useContext(UIContext)

  function handleLikeComment() {
    likeDislikeComment(comment.id).then((res) => {
      if (res.data) {
        postDispatch({ type: 'LIKE_UNLIKE_COMMENT', payload: res.data.comment })
        uiDispatch({
          type: 'SET_MESSAGE',
          payload: { color: 'success', text: res.data.message, display: true },
        })
      }
    })
  }

  function isLiked() {
    return comment.likes.includes(userState.currentUser.id)
  }

  const [isOpen, setIsOpen] = useState(null);
  const [commentText, setCommentText] = useState(comment.body.text ? comment.body.text : '');
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(''); 
  const handleEditComment = (e) => {
    setError('')
    setCommentText(e.target.value)
  }
  
  const listItems = (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        {comment.user.profile_pic ? (
          <Avatar>
            <img
              src={comment.user.profile_pic}
              style={{ width: '100%', height: '100%' }}
              alt={comment.user.name}
            />
          </Avatar>
        ) : (
          <AvartarText
            text={comment.user.name}
            bg={comment.user.active ? 'seagreen' : 'tomato'}
          />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography style={{ color: uiState.darkMode && '#fff' }}>
            {comment.user.name}
          </Typography>
        }
        secondary={
          <>
            {isEdit ?
              <div style={{display: "flex"}}>
                <TextField
                  error={error ? true : false}
                  helperText={error}
                  value={commentText}
                  onChange={handleEditComment}
                  multiline
                  rowsMax={4}
                  style={{
                    width: '100%',
                    borderRadius: '20px',
                    border: 'none',
                    background: uiState.darkMode ? 'rgb(24,25,26)': 'rgb(240,242,245)',
                    padding: '8px 16px',
                  }}
                />
                <IconButton onClick={() => {
                  editComment({ id: comment.id, body: { text: commentText } }).then((res) => {
                    if (res.data.message === "success") {
                      setIsEdit(false);
                    }
                  })
                }}>
                  <SendOutlined />
                </IconButton>
              </div> : 
              commentText
            }

            {comment.body.image && (
              <CardMedia
                component={comment.body.image.split('.').pop().substring(0, 3) === "mp4" ? "video" : "img"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                image={comment.body.image}
                title="Paella dish"
                controls
              />
            )}
          </>
        }
      />
      <div>
        <IconButton onClick={(e) => setIsOpen(e.currentTarget)}>
          <MoreHoriz />
        </IconButton>

        <Menu
          id="comment-action-menu"
          anchorEl={isOpen}
          open={Boolean(isOpen)}
          onClose={() => setIsOpen(null)}
        >
          <MenuItem 
            onClick={() => {
              setIsOpen(null)
              setIsEdit(true);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => {
            // deleteComment(post.id).then((res) => {
            //   if (res.data.message === "success") {
            //     handleDeletePost(post.id)
            //   }
            // })
          }}>Delete</MenuItem>
        </Menu>
      </div>
    </ListItem>
  )
  return (
    <div
      style={{ marginTop: '16px', marginBottom: !uiState.mdScreen && '50px' }}
    >
      <List>
        {listItems}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={handleLikeComment}
            size="small"
            color="primary"
            startIcon={
              isLiked() ? (
                <FontAwesomeIcon icon={filledLike} size="sm" />
              ) : (
                <FontAwesomeIcon icon={faThumbsUp} size="sm" />
              )
            }
          >
            ({comment.likes.length})
          </Button>
        </div>
        <Divider variant="inset" component="li" />
      </List>
    </div>
  )
}

export default Comment
