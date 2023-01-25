import {
  Avatar,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-solid-svg-icons'
import EmojiPicker from 'emoji-picker-react'
import React, { useContext, useState, useRef } from 'react'
import AvartarText from '../UI/AvartarText'
import StyledBadge from '../UI/StyledBadge'
import { UIContext, UserContext } from '../../App'
import { SendOutlined } from '@material-ui/icons'
import useCreateComment from '../../hooks/useCreateComment'
import PreviewImage from '../Post/PostForm/PostDialog/PreviewImage';
import FileField from '../Post/PostForm/PostDialog/FileField';

function CommentTextArea({ post }) {
  const { userState } = useContext(UserContext)
  const { uiState } = useContext(UIContext)

  const [commentText, setCommentText] = useState('')
  const [commentImage, setCommentImage] = useState(null)
  const [error, setError] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const fileRef = useRef();
  const [previewImage, setPreviewImage] = useState('')

  const handleImageChange = (e) => {
    setCommentImage(e.target.files[0])

    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      setPreviewImage(reader.result)
    }
  }

  function removeFileImage() {
    setPreviewImage('')
    setCommentImage(null)
  }

  const { handleSubmitComment, loading } = useCreateComment({
    post_id: post.id,
    commentText,
    setCommentText,
    setCommentImage,
    commentImage,
    setError,
    removeFileImage,
    setShowEmoji,
  })

  const handleCommentChange = (e) => {
    setError('')
    setCommentText(e.target.value)
  }

  const onEmojiClick = (e, emojiObject) => {
    setError('')
    setCommentText(commentText + emojiObject.emoji)
  }

  return (
    <>
      <Grid
        container
        justify="flex-start"
        spacing={1}
        style={{
          marginTop: '8px',
          marginBottom: '8px',
        }}
      >
        <Grid item>
          <StyledBadge isActive={userState.currentUser.active}>
            {userState.currentUser.profile_pic ? (
              <Avatar>
                <img
                  src={userState.currentUser.profile_pic}
                  style={{ width: '100%', height: '100%' }}
                  alt={userState.currentUser.name}
                />
              </Avatar>
            ) : (
              <AvartarText text={userState.currentUser.name} bg="tomato" />
            )}
          </StyledBadge>
        </Grid>
        <Grid item md={8} sm={8} xs={8}>
          <TextField
            placeholder="Write a Comments..."
            error={error ? true : false}
            helperText={error}
            value={commentText}
            onChange={handleCommentChange}
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
          <FileField fileRef={fileRef} />
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileRef}
            onChange={handleImageChange}
            accept="image/*,video/*"
            capture="user"
          />
          <IconButton onClick={() => setShowEmoji(!showEmoji)}>
            <FontAwesomeIcon icon={faSmile} color="rgb(250,199,94)" />
          </IconButton>
          {showEmoji && (
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              className="emoji-container"
            />
          )}
        </Grid>
        <Grid item ms={2} sm={2} xs={2}>
        <IconButton onClick={handleSubmitComment}>
            <SendOutlined />
          </IconButton>
        </Grid>
      </Grid>

      {loading ? (
        <Paper
          elevation={0}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <LinearProgress color="primary" style={{ width: '100%' }} />
        </Paper>
      ) : null}

      {previewImage && (
        <>
          <PreviewImage
            previewImage={previewImage}
            removeFileImage={removeFileImage}
          />
        </>
      )}
    </>
  )
}

export default CommentTextArea
